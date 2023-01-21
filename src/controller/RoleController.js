
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { Role } from "../db/model/index.js";
import { response } from "../util/index.js";
const RoleController = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const role = await Role.findOne({
                where: { id }
            }).then(r => r?.toJSON() || null)
            const records = !!role ? [role] : [];
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
            const result = await Role.findAndCountAll({
                where: {
                    ...searchModel
                },
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
            const { role } = body;
            role.createdBy = role.createdBy || _user.id
            const vehicleTypedb = await Role.create(role).then(r => r?.toJSON() || null);
            const records = !!vehicleTypedb ? [vehicleTypedb] : [];
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
            const { roleType } = body;
            roleType.updatedBy = _user.id
            const roleIddb = await Role.update(roleType, {
                where: {
                    [Op.or]: [
                        { id: roleType.id || 0 },
                    ],
                }
            })
            const roledb = await Role.findOne({
                where: {
                    id: roleType.id || 0,
                }
            }).then(r => r?.toJSON() || null)
            const records = !!roledb ? [roledb] : [];
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
            const { roleIds, roleUpdates } = body;
            roleUpdates.updatedBy = _user.id
            const rolesIddb = await Role.update(roleUpdates, {
                where: {
                    id: {
                        [Op.in]: roleIds
                    },
                }
            })
            const roleIdsdb = await Role.findAll({
                where: {
                    id: {
                        [Op.in]: roleIds
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!roleIdsdb && roleIdsdb.length > 0 ? [roleIdsdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { roleIds } = body;
            const rolesCountdb = await Role.destroy({
                where: {
                    id: {
                        [Op.in]: roleIds
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

export default RoleController