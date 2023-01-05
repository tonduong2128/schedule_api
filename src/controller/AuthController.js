
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
                const newResponse = response(res, RESPONSE_CODE.SUCCESS);
                newResponse.token = token
                res.json(newResponse);
            } else {
                res.json(response(res, RESPONSE_CODE.ERROR))
            }
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async resetForce(req, res, next) {
        try {
            const { _user } = req.locals
            const { user } = req.body
            const userdb = await User.findOne({
                where: {
                    id: user.id || 0
                }
            })
            if (!_user && !userdb) {
                throw new Error("Authen faild in reset password");
            }
            await userdb.update({
                password: user.password,
            })
            res.json(response(res, RESPONSE_CODE.SUCCESS))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    }
}

export default AuthController