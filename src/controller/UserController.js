
import { User } from "../db/model/index.js"
const UserComtroller = {
    async getById(req, res, next) {
        const user = await User.findAll({

        })
        res.json(user)
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