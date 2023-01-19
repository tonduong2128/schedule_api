
import { Op } from "sequelize";
import { RESPONSE_CODE } from "../constant/index.js";
import { Vehicle_Type } from "../db/model/index.js";
import { response } from "../util/index.js";
const VehicleTypeController = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const vehicleTypedb = await Vehicle_Type.findOne({
                where: { id }
            }).then(r => r?.toJSON() || null)
            const records = !!vehicleTypedb ? [vehicleTypedb] : [];
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
            const result = await Vehicle_Type.findAndCountAll({
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
            const { vehicleType } = body;
            vehicleType.createdBy = vehicleType.createdBy || _user.id
            const vehicleTypedb = await Vehicle_Type.create(vehicleType).then(r => r?.toJSON() || null);
            const records = !!vehicleTypedb ? [vehicleTypedb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { body } = req;
            const { vehicleType } = body;
            const vehicleTypeIddb = await Vehicle_Type.update(vehicleType, {
                where: {
                    [Op.or]: [
                        { id: vehicleType.id || 0 },
                    ],
                }
            })
            const vehicleTypedb = await Vehicle_Type.findOne({
                where: {
                    id: vehicleType.id || 0,
                }
            }).then(r => r?.toJSON() || null)
            const records = !!vehicleTypedb ? [vehicleTypedb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async updateMany(req, res, next) {
        try {
            const { body } = req;
            const { vehicleTypeIds, vehicleTypeUpdates } = body;
            const vehicleTypesIddb = await Vehicle_Type.update(vehicleTypeUpdates, {
                where: {
                    id: {
                        [Op.in]: vehicleTypeIds
                    },
                }
            })
            const vehicleTypeIdsdb = await Vehicle_Type.findAll({
                where: {
                    id: {
                        [Op.in]: vehicleTypeIds
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!vehicleTypeIdsdb && vehicleTypeIdsdb.length > 0 ? [vehicleTypeIdsdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { vehicleTypeIds } = body;
            const vehicleTypesCountdb = await Vehicle_Type.destroy({
                where: {
                    id: {
                        [Op.in]: vehicleTypeIds
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

export default VehicleTypeController