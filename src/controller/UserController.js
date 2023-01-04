
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { User } from "../db/model/index.js";
import { response } from "../util/index.js";
const UserComtroller = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const userdb = await User.findOne({
                where: { id }
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
        }
    },
    async search(req, res, next) {
        try {
            res.json("search")
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
        }
    },
    async create(req, res, next) {
        try {
            const { body } = req;
            const { user } = body;
            const userdb = await User.create(user).then(r => r?.toJSON() || null);
            const records = !!userdb ? [userdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
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
                    [Op.or]: [
                        { id: user.id || 0 },
                        { username: user.username }
                    ],
                }
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
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
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
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
            res.json(response(req, RESPONSE_CODE.SUCCESS, []))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
        }
    },
}

export default UserComtroller