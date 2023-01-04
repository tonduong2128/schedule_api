
import { RESPONSE_CODE } from "../constant/index.js";
import { User } from "../db/model/index.js";
import { response } from "../util/index.js";
const UserComtroller = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const { token } = req.locals
            const user = await User.findOne({
                where: { id }
            }).then(r => r?.toJSON() || null)
            const records = !!user ? [user] : [];
            res.json(response(req, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
        }
    },
    async search(req, res, next) {
        res.json("search")
    },
    async create(req, res, next) {
        res.json("create")
    },
    async update(req, res, next) {
        res.json("update")
    },
    async delete(req, res, next) {
        res.json("delete")
    },
}

export default UserComtroller