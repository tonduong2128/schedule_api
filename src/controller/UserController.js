
import { Op } from "sequelize";
import { RESPONSE_CODE, ROLE } from "../constant/index.js";
import { Role, User } from "../db/model/index.js";
import { response } from "../util/index.js";
const UserComtroller = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const userdb = await User.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "Teachers",
                    },
                ]
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
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
            let searchModel = JSON.parse(query.searchModel);
            const searchOther = JSON.parse(query.searchOther);
            const limit = searchOption.limit;
            const page = searchOption.page;
            const offset = (page - 1) * limit;
            const order = []

            const { isAdmin } = searchOther;
            let queryIncludes = []
            if (isAdmin) {
                searchModel = {}
                queryIncludes = [{
                    model: Role,
                    as: "Roles",
                    where: {
                        id: ROLE.teacher
                    }
                }]
            }

            const result = await User.findAndCountAll({
                where: {
                    ...searchModel
                },
                include: queryIncludes,
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
            const { user } = body;
            user.createdBy = _user.id
            const userdb = await User.create(user).then(r => r?.toJSON() || null);
            const records = !!userdb ? [userdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { body } = req;
            const { user } = body;
            const userIddb = await User.update(user, {
                where: {
                    [Op.or]: [
                        { id: user.id || 0 },
                        { username: user.username }
                    ],
                }
            })
            const userdb = await User.findOne({
                where: {
                    id: user.id || 0,
                }
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async updateMany(req, res, next) {
        try {
            const { body } = req;
            const { userIds, userUpdates } = body;
            const usersIddb = await User.update(userUpdates, {
                where: {
                    id: {
                        [Op.in]: userIds
                    },
                }
            })
            const usersdb = await User.findAll({
                where: {
                    id: {
                        [Op.in]: userIds
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!usersdb && usersdb.length > 0 ? [usersdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { userIds } = body;
            const usersCountdb = await User.destroy({
                where: {
                    id: {
                        [Op.in]: userIds
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

export default UserComtroller