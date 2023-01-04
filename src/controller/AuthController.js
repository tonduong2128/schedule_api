
import { RESPONSE_CODE } from "../constant/index.js";
import { User } from "../db/model/index.js"
import { bcrypt, response } from "../util/index.js";
import jwt from "jsonwebtoken"

const AuthController = {
    async login(req, res, next) {
        try {
            const { body } = req;
            const { user } = body;
            const userdb = await User.findOne({
                where: {
                    username: user.username
                }
            }).then(r => r?.toJSON() || null)
            const matchPassword = bcrypt.compare(user.password, userdb.password)
            if (matchPassword) {
                const token = jwt.sign(userdb, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                res.json(response(res, RESPONSE_CODE.SUCCESS, token, []))
            } else {
                res.json(response(res, RESPONSE_CODE.ERROR, null, []))
            }
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL, []))
        }
    },
}

export default AuthController