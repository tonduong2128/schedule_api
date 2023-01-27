
import e from "cors";
import moment from "moment";
import { Op } from "sequelize";
import { RESPONSE_CODE, SPECIFIC_SCHEDULE, STATUS_RESERVATION, TYPEOF_SPECIFIC_SCHEDULE } from "../constant/index.js";
import { Reservation, User, Vehicle_Type } from "../db/model/index.js";
import TeacherHour from "../db/model/teacher_hour.js";
import { response } from "../util/index.js";
const ReservationController = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const reservationdb = await Reservation.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "CreatedBy",
                    },
                    {
                        model: User,
                        as: "UpdatedBy",
                    },
                    {
                        model: User,
                        as: "Teacher",
                    },
                    {
                        model: User,
                        as: "Student",
                    },
                    {
                        model: Vehicle_Type,
                        as: "VehicleType"
                    }
                ]
            }).then(r => r?.toJSON() || null)
            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async search(req, res, next) {
        try {
            const { query } = req;
            const { _user } = res.locals;
            const searchOption = JSON.parse(query.searchOption);
            const searchModel = JSON.parse(query.searchModel);


            const limit = searchOption.limit;
            const page = searchOption.page;
            const offset = (page - 1) * limit;
            const order = []

            let beforeRecord = []
            if (searchModel.teacherId && searchModel.targetDate.$between) {
                const start = searchModel.targetDate.$between[0]
                const end = searchModel.targetDate.$between[1]

                const teacherHour = await TeacherHour.findOne({
                    where: {
                        createdBy: searchModel.teacherId,
                        status: SPECIFIC_SCHEDULE.enable,
                    }
                })
                if (teacherHour) {
                    const hours = JSON.parse(teacherHour.hours)
                    const typeOfSchedule = teacherHour.typeOf;
                    const [teacher] = await Promise.all([
                        User.findOne({ where: { id: searchModel.teacherId } }).then(r => r.toJSON())
                    ])
                    for (const curDate = moment(start); curDate.isSameOrBefore(moment(end)); curDate.add(1, "day")) {
                        if (curDate.isBefore(moment(moment().format("YYYY-MM-DD")))) { continue }
                        let hour = hours[curDate.day()]
                        if (typeOfSchedule === TYPEOF_SPECIFIC_SCHEDULE.BUSY) {
                            //donothing
                        } else {
                            let busys = [{
                                startTime: "00:00:00",
                                endTime: "23:59:59",
                                reason: ""
                            }]
                            hour.forEach(h => {
                                const index = busys.findIndex(bs => h.startTime >= bs.startTime && h.endTime <= bs.endTime)
                                const itemDelete = busys[index];
                                busys.splice(index, 1,
                                    {
                                        startTime: itemDelete.startTime,
                                        endTime: h.startTime,
                                        reason: h.reason
                                    },
                                    {
                                        startTime: h.endTime,
                                        endTime: itemDelete.endTime,
                                        reason: h.reason
                                    }
                                )
                            })
                            hour = busys;
                        }
                        beforeRecord.push(...hour.map(h => ({
                            id: 0,
                            targetDate: curDate.format("YYYY-MM-DD"),
                            startTime: h.startTime,
                            endTime: h.endTime,
                            vehicleTypeId: null,
                            status: STATUS_RESERVATION.ofWeek,
                            reason: h.reason,

                            studentId: searchModel.teacherId,
                            Student: teacher,

                            teacherId: searchModel.teacherId,
                            Teacher: teacher,

                            createdBy: teacherHour.createdBy,
                            CreatedBy: teacherHour.createdBy ? teacher : undefined,

                            updatedBy: teacherHour.updatedBy,
                            UpdatedBy: teacherHour.updatedBy ? teacher : undefined,

                            createdDate: teacherHour.createdDate,
                            updatedDate: teacherHour.updatedDate,
                        })))

                    }
                }
            }

            const result = await Reservation.findAndCountAll({
                where: {
                    ...searchModel
                },
                include: [
                    {
                        model: User,
                        as: "CreatedBy",
                    },
                    {
                        model: User,
                        as: "UpdatedBy",
                    },
                    {
                        model: User,
                        as: "Teacher",
                    },
                    {
                        model: User,
                        as: "Student",
                    },
                    {
                        model: Vehicle_Type,
                        as: "VehicleType"
                    }
                ],
                limit,
                offset,
                order,
            })
            const records = result.rows;
            const count = result.count;
            const page_count = Math.ceil(count / limit);
            res.json(response(res, RESPONSE_CODE.SUCCESS, [...records, ...beforeRecord], count, limit, page, page_count))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async create(req, res, next) {
        try {
            const { _user } = res.locals;
            const { body } = req;
            const { reservation } = body;
            const timeValid = reservation.startTime < reservation.endTime;
            if (!timeValid) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_TIME_NOT_VALID))
            }

            if (!(await checkBeforCreateOrUpdate(reservation))) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_BUSY, []))
            }

            reservation.createdBy = _user.id;
            const reservationdbOld = await Reservation.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { teacherId: reservation.teacherId },
                                { studentId: reservation.studentId }
                            ]
                        },
                        { targetDate: reservation.targetDate },
                        {
                            [Op.or]: [
                                {
                                    startTime: {
                                        [Op.lte]: reservation.startTime
                                    },
                                    endTime: {
                                        [Op.gt]: reservation.startTime
                                    }
                                },
                                {
                                    startTime: {
                                        [Op.lt]: reservation.endTime
                                    },
                                    endTime: {
                                        [Op.gte]: reservation.endTime
                                    }
                                },
                                {
                                    startTime: {
                                        [Op.gte]: reservation.startTime
                                    },
                                    endTime: {
                                        [Op.lte]: reservation.endTime
                                    }
                                },
                            ]
                        }
                    ],
                }
            })

            if (reservationdbOld?.studentId === reservation.studentId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS_USER, []))
            }
            if (reservationdbOld?.teacherId === reservation.teacherId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS, []))
            }

            reservation.createdBy = _user.id
            const reservationdb = await Reservation.create(reservation)
                .then(async r => {
                    const reservation = r?.toJSON() || {};
                    return Reservation.findOne({
                        where: { id: reservation.id },
                        include: [
                            {
                                model: User,
                                as: "CreatedBy",
                            },
                            {
                                model: User,
                                as: "UpdatedBy",
                            },
                            {
                                model: User,
                                as: "Teacher",
                            },
                            {
                                model: User,
                                as: "Student",
                            },
                            {
                                model: Vehicle_Type,
                                as: "VehicleType"
                            }
                        ]
                    }).then(r => r.toJSON() || null)
                });
            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { _user } = res.locals
            const { body } = req;
            const { reservation } = body;

            const timeValid = reservation.startTime < reservation.endTime;
            if (!timeValid) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_TIME_NOT_VALID))
            }

            if (!(await checkBeforCreateOrUpdate(reservation))) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_BUSY, []))
            }

            const reservationdbOld = await Reservation.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { teacherId: reservation.teacherId },
                                { studentId: reservation.studentId }
                            ]
                        },
                        { id: { [Op.ne]: reservation.id } },
                        { targetDate: reservation.targetDate },
                        {
                            [Op.or]: [
                                {
                                    startTime: {
                                        [Op.lte]: reservation.startTime
                                    },
                                    endTime: {
                                        [Op.gt]: reservation.startTime
                                    }
                                },
                                {
                                    startTime: {
                                        [Op.lt]: reservation.endTime
                                    },
                                    endTime: {
                                        [Op.gte]: reservation.endTime
                                    }
                                },
                                {
                                    startTime: {
                                        [Op.gte]: reservation.startTime
                                    },
                                    endTime: {
                                        [Op.lte]: reservation.endTime
                                    }
                                },
                            ]
                        }
                    ],
                }
            })
            if (reservationdbOld?.studentId === reservation.studentId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS_USER, []))
            }
            if (reservationdbOld?.teacherId === reservation.teacherId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS, []))
            }
            reservation.updatedBy = _user.id;
            reservation.updatedDate = moment()
            const reservationIddb = await Reservation.update(reservation, {
                where: {
                    id: reservation.id || 0
                }
            })
            const reservationdb = await Reservation.findOne({
                where: {
                    id: reservation.id || 0,
                },
                include: [
                    {
                        model: User,
                        as: "CreatedBy",
                    },
                    {
                        model: User,
                        as: "UpdatedBy",
                    },
                    {
                        model: User,
                        as: "Teacher",
                    },
                    {
                        model: User,
                        as: "Student",
                    },
                    {
                        model: Vehicle_Type,
                        as: "VehicleType"
                    }
                ]
            }).then(r => r?.toJSON() || null)

            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async updateMany(req, res, next) {
        try {
            const { _user } = res.locals
            const { body } = req;
            const { reservationIds, reservationUpdates } = body;
            reservationUpdates.updatedBy = _user.id;
            reservationUpdates.updatedDate = moment()
            const reservationIddb = await Reservation.update(reservationUpdates, {
                where: {
                    id: {
                        [Op.in]: reservationIds
                    },
                }
            })
            const reservationsdb = await Reservation.findAll({
                where: {
                    id: {
                        [Op.in]: reservationIds
                    },
                },
                include: [{
                    model: User,
                    as: "CreatedBy",
                },
                {
                    model: User,
                    as: "UpdatedBy",
                },
                {
                    model: User,
                    as: "Teacher",
                },
                {
                    model: User,
                    as: "Student",
                },
                {
                    model: Vehicle_Type,
                    as: "VehicleType"
                }]
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!reservationsdb && reservationsdb.length > 0 ? [reservationsdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { reservationIds } = body;
            const reservationsCountdb = await Reservation.destroy({
                where: {
                    id: {
                        [Op.in]: reservationIds
                    }
                }
            })
            res.json(response(res, RESPONSE_CODE.SUCCESS))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
}
const checkBeforCreateOrUpdate = async (reservation) => {
    const teacherHour = await TeacherHour.findOne({
        where: {
            createdBy: reservation.teacherId,
            status: SPECIFIC_SCHEDULE.enable,
        }
    })
    if (teacherHour) {
        const hours = JSON.parse(teacherHour.hours)
        const typeOfSchedule = teacherHour.typeOf;
        const date = moment(reservation.targetDate, "YYYY-MM-DD")
        const hour = hours[date.day()]
        if (typeOfSchedule === TYPEOF_SPECIFIC_SCHEDULE.BUSY) {
            return !hour.some(h => !(reservation.startTime >= h.endTime || reservation.endTime <= h.startTime))
        } else {
            return hour.some(h => reservation.startTime >= h.startTime && reservation.endTime <= h.endTime)
        }
    }
    return true
}

export default ReservationController