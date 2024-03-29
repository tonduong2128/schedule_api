import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import { RESPONSE_CODE, ROLE, STATUS_USER } from "../constant/index.js";
import { Role, User, User_Role } from "../db/model/index.js";
import { response } from "../util/index.js";

const auth = async (req, res, next) => {
    try {
        res.locals = {}
        const token = req.headers.authorization;
        const _user = jwt.decode(token, process.env.SECRET_KEY);
        if (!_user) {
            return res.status(200).json(response(res, RESPONSE_CODE.USER_EXPIRED))
        }
        const userdb = await User.findOne({
            where: {
                id: _user.id,
                username: _user.username,
            },
            include: [
                {
                    model: Role,
                    as: "Roles",
                },
                {
                    model: User,
                    as: "Teachers",
                }
            ]
        }).then(r => r?.toJSON() || null)
        const roleIds = userdb.Roles.map(r => r.id);

        const dateNow = moment().toDate().getTime();
        if (_user.exp * 1000 < dateNow) {
            return res.status(200).json(response(res, RESPONSE_CODE.TOKEN_EXPIRED))
        }
        if (userdb.status === STATUS_USER.exprid || (!roleIds.includes(ROLE.admin) && userdb.dateExpired < moment().format("YYYY-MM-DD"))) {
            return res.status(200).json(response(res, RESPONSE_CODE.USER_EXPIRED))
        }
        const newToken = jwt.sign(userdb, process.env.SECRET_KEY, { expiresIn: "7d" });
        res.locals._user = userdb;
        res.locals.token = newToken;
        next()
    } catch (error) {
        console.log(error);
        res.status(200).json(response(res, RESPONSE_CODE.AUTHORIZATION_FAILD))
    }
}

export default auth