const auth = (req, res, next) => {
    req.locals = {}
    next()
}

export default auth