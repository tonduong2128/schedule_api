const UserComtroller = {
    getById(req, res, next) {
        res.json("getById")
    },
    search(req, res, next) {
        res.json("search")
    },
    create(req, res, next) {
        res.json("create")
    },
    update(req, res, next) {
        res.json("update")
    },
    delete(req, res, next) {
        res.json("delete")
    },
}

export default UserComtroller