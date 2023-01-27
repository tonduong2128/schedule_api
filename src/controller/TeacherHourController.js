
import moment from "moment";
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { User, Teacher_Hour } from "../db/model/index.js";
import { response } from "../util/index.js";
const TeacherHourController = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const teacherHourdb = await Teacher_Hour.findOne({
                where: { id },
                include: [
                ]
            }).then(r => r?.toJSON() || null)
            const records = !!teacherHourdb ? [teacherHourdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async search(req, res, next) {
        try {
            const { query } = req;
            const searchOption = JSON.parse(query.searchOption);
            const searchModel = JSON.parse(query.searchModel);

            const limit = searchOption.limit;
            const page = searchOption.page;
            const offset = (page - 1) * limit;
            const order = []
            const result = await Teacher_Hour.findAndCountAll({
                where: {
                    ...searchModel
                },
                include: [

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
            const { _user } = res.locals
            const { body } = req;
            const { teacherHour } = body;
            teacherHour.createdBy = _user.id
            const teacherHourdb = await Teacher_Hour.create(teacherHour).then(r => r?.toJSON() || null);
            const records = !!teacherHourdb ? [teacherHourdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { _user } = res.locals;
            const { body } = req;
            const { teacherHour } = body;
            teacherHour.updatedBy = _user.id;
            teacherHour.updatedDate = moment()
            const teacherHourIddb = await Teacher_Hour.update(teacherHour, {
                where: {
                    [Op.or]: [
                        { id: teacherHour.id || 0 },
                    ],
                }
            })
            const teacherHourdb = await Teacher_Hour.findOne({
                where: {
                    id: teacherHour.id || 0,
                }
            }).then(r => r?.toJSON() || null)
            const records = !!teacherHourdb ? [teacherHourdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async updateMany(req, res, next) {
        try {
            const { _user } = res.locals;
            const { body } = req;
            const { teacherHourIds, teacherHourUpdates } = body;
            teacherHourUpdates.updatedBy = _user.id
            teacherHourUpdates.updatedDate = moment()
            const teacherHoursIddb = await Teacher_Hour.update(teacherHourUpdates, {
                where: {
                    id: {
                        [Op.in]: teacherHourIds
                    },
                }
            })
            const teacherHourIdsdb = await Teacher_Hour.findAll({
                where: {
                    id: {
                        [Op.in]: teacherHourIds
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!teacherHourIdsdb && teacherHourIdsdb.length > 0 ? [teacherHourIdsdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { teacherHourIds } = body;
            const teacherHoursCountdb = await Teacher_Hour.destroy({
                where: {
                    id: {
                        [Op.in]: teacherHourIds
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

export default TeacherHourController