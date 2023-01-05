import jwt from "jsonwebtoken"
import { RESPONSE_CODE } from "../constant";
import { response } from "../util";

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const _user = jwt.decode(token, process.env.SECRET_KEY);
        req.locals = {}
        req.locals._user = _user;
        next()
    } catch (error) {
        res.json(response(res, RESPONSE_CODE.AUTHORIZATION_FAILD))
    }
}

export default auth