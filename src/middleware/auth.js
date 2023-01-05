import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    const _user = jwt.decode(token, process.env.SECRET_KEY);
    req.locals = {}
    req.locals._user = _user;
    next()
}

export default auth