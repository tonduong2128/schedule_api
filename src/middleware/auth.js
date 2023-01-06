import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import { RESPONSE_CODE } from "../constant/index.js";
import { Role, User, User_Role } from "../db/model/index.js";
import { response } from "../util/index.js";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const _user = jwt.decode(token, process.env.SECRET_KEY);
        const userdb = await User.findOne({
            where: {
                id: _user.id
            },
            include: [
                {
                    model: Role,
                    as: "Roles",
                    attributes: ["code"]
                }
            ]
        }).then(r => r?.toJSON() || null)
        const dateNow = moment().toDate().getTime();
        // if (_user.exp * 1000 < dateNow) {
        //     return res.json(response(res, RESPONSE_CODE.TOKEN_EXPIRED))
        // }
        const newToken = jwt.sign(userdb, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
        req.locals = {}
        req.locals._user = userdb;
        req.locals.token = newToken;
        next()
    } catch (error) {
        console.log(error);
        res.json(response(res, RESPONSE_CODE.AUTHORIZATION_FAILD))
    }
}

export default auth