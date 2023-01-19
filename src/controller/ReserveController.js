
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { Reservation, User, Vehicle_Type } from "../db/model/index.js";
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

            const result = await Reservation.findAndCountAll({
                where: {
                    ...searchModel
                },
                include: [
                    {
                        model: User,
                        as: "CreatedBy"
                    }
                ],
                limit,
                offset,
                order,
            })
            const records = result.rows;
            const count = result.count;
            const page_count = Math.ceil(count / limit);
            res.json(response(res, RESPONSE_CODE.SUCCESS, records, count, limit, page, page_count))
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
            reservation.createdBy = reservation.createdBy || _user.id;
            const reservationdbOld = await Reservation.findOne({
                where: {
                    id: { [Op.ne]: reservation.id },
                    [Op.or]: [
                        { teacherId: reservation.teacherId },
                        { createdBy: reservation.createdBy }
                    ],
                    targetDate: reservation.targetDate,
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
            })

            if (reservationdbOld?.createdBy === _user.id) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS_USER, []))
            }
            if (reservationdbOld?.teacherId === reservation.teacherId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS, []))
            }

            reservation.createdBy = reservation.createdBy || _user.id
            const reservationdb = await Reservation.create(reservation)
                .then(async r => {
                    const reservation = r?.toJSON() || {};
                    return Reservation.findOne({
                        where: { id: reservation.id },
                        include: [
                            {
                                model: User,
                                as: "CreatedBy"
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
            const reservationdbOld = await Reservation.findOne({
                where: {
                    id: { [Op.ne]: reservation.id },
                    [Op.or]: [
                        { teacherId: reservation.teacherId },
                        { createdBy: reservation.createdBy }
                    ],
                    targetDate: reservation.targetDate,
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
            })
            if (reservationdbOld?.createdBy === _user.id) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS_USER, []))
            }
            if (reservationdbOld?.teacherId === reservation.teacherId) {
                return res.json(response(res, RESPONSE_CODE.RESERVATION_EXISTS, []))
            }
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
                        as: "CreatedBy"
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
            const { body } = req;
            const { reservationIds, reservationUpdates } = body;
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
                    as: "CreatedBy"
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

export default ReservationController