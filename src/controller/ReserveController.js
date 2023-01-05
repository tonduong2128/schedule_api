
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { Reservation } from "../db/model/index.js"
import { response } from "../util/index.js";
const ReservationController = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const reservationdb = await Reservation.findOne({
                where: { id }
            }).then(r => r?.toJSON() || null)
            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async search(req, res, next) {
        try {
            res.json("search")
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async create(req, res, next) {
        try {
            const { _user } = req.locals;
            const { body } = req;
            const { reservation } = body;
            const timeValid = reservation.startTime <= reservation.endTime;
            if (!timeValid) {
                return res.json(response(req, RESPONSE_CODE.RESERVATION_TIME_NOT_VALID))
            }
            const checkReservationExists = await Reservation.findOne({
                where: {
                    teacherId: reservation.teacherId,
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
                    ]
                }
            })

            if (!!checkReservationExists) {
                return res.json(response(req, RESPONSE_CODE.RESERVATION_EXISTS, records))
            }

            reservation.createdBy = _user.id;
            const reservationdb = await Reservation.create(reservation).then(r => r?.toJSON() || null);
            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { body } = req;
            const { reservation } = body;
            const reservationIddb = await Reservation.update(reservation, {
                where: {
                    id: reservation.id || 0
                }
            })
            const reservationdb = await Reservation.findOne({
                where: {
                    id: reservation.id || 0,
                }
            }).then(r => r?.toJSON() || null)

            const records = !!reservationdb ? [reservationdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
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
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!reservationsdb && reservationsdb.length > 0 ? [reservationsdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
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
            res.json(response(req, RESPONSE_CODE.SUCCESS))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
}

export default ReservationController