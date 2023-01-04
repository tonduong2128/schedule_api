
import { Reservation } from "../db/model/index.js"
const ReservationController = {
    async getById(req, res, next) {
        res.json("getById")
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

export default ReservationController