
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { RESPONSE_CODE, STATUS_USER } from "../constant/index.js";
import { Role, User } from "../db/model/index.js";
import { bcrypt, response } from "../util/index.js";
import { MailService } from "../service/index.js"
import Otp_Record from "../db/model/otp_record.js";
import moment from "moment";
import { publicIpv4 } from "public-ip";


const AuthController = {
    async login(req, res, next) {
        try {
            const { body } = req;
            const { user } = body;
            const userdb = await User.findOne({
                where: {
                    username: user.username,
                },
                include: [
                    {
                        model: Role,
                        as: "Roles",
                    },
                    {
                        model: User,
                        as: "Teachers",
                    },
                    {
                        model: User,
                        as: "Students",
                    },
                ]
            }).then(r => r?.toJSON() || null)
            const matchPassword = bcrypt.compare(user.password, userdb.password)
            if (matchPassword) {
                if (userdb.status === STATUS_USER.exprid) {
                    return res.json(response(res, RESPONSE_CODE.USER_EXPIRED))
                }
                const token = jwt.sign(userdb, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                const newResponse = response(res, RESPONSE_CODE.SUCCESS);
                newResponse.token = token
                res.json(newResponse);
            } else {
                res.json(response(res, RESPONSE_CODE.ERROR))
            }
        } catch (error) {
            const ip = await publicIpv4().then(ip => ip);
            console.log("IP: " + ip);
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async resetForce(req, res, next) {
        try {
            const { _user } = res.locals
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
    },
    async reset(req, res, next) {
        try {
            const { user, optCode } = req.body
            const { username, phone, email, password } = user;
            const userdb = await User.findOne({
                where: {
                    username: username,
                    [Op.or]: [
                        { phone: phone || null },
                        { email: email || null }
                    ]
                }
            })
            if (!userdb) {
                return res.json(response(res, RESPONSE_CODE.USERNAME_OR_PASSWORD_NOT_MATCH))
            }
            if (!optCode) {
                const code = randomCode(5);
                const sms_record = {
                    code,
                    used: false,
                    createdBy: userdb.id,
                    createdDate: moment()
                }
                const sms_recorddb = await Otp_Record.create(sms_record);
                const mail_send = await MailService.sendMail(email,
                    "Lấy lại mật khẩu",
                    `Mã của bạn là: ${code} \n Mã sẽ hết hạn sau: ${process.env.OTP_EXPRID} phút.`);
                if (!!sms_recorddb && !!mail_send) {
                    return res.json(response(res, RESPONSE_CODE.SUCCESS))
                } else {
                    throw Error("Cannot create sms record")
                }
            } else {
                const sms_recorddb = await Otp_Record.findOne({
                    where: {
                        createdBy: userdb.id,
                        updatedBy: null,
                        code: optCode,
                        createdDate: {
                            [Op.lte]: moment().add(process.env.OTP_EXPRID, "minute"),
                        },
                        used: false
                    }
                });
                if (!!sms_recorddb) {
                    await sms_recorddb.update({
                        updatedBy: userdb.id
                    });
                    return res.json(response(res, RESPONSE_CODE.SUCCESS))
                } else {
                    const sms_recorddb_2 = await Otp_Record.findOne({
                        where: {
                            createdBy: userdb.id,
                            updatedBy: userdb.id,
                            createdDate: {
                                [Op.lte]: moment().add(process.env.OTP_EXPRID, "minute"),
                            },
                            used: false
                        }
                    });
                    if (sms_recorddb_2) {
                        sms_recorddb_2.update({
                            used: true
                        })
                        await userdb.update({
                            password,
                        })
                        return res.json(response(res, RESPONSE_CODE.SUCCESS))
                    } else {
                        throw Error("Opt exprid")
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async changePassword(req, res, next) {
        try {
            const { _user } = res.locals
            const { oldPassword, newPassword } = req.body
            const user = await User.findOne({
                id: _user.id
            })
            const matchPassword = bcrypt.compare(oldPassword, user.password);
            if (matchPassword) {
                await user.update({
                    passowrd: newPassword
                })
                res.json(response(res, RESPONSE_CODE.SUCCESS))
            } else {
                res.json(response(res, RESPONSE_CODE.OLD_PASSWORD_NOT_MATCH))
            }
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    }
}

const randomCode = (count) => {
    const random = () => Math.ceil(Math.random() * 10)
    let code = ""
    for (let index = 0; index < count; index++) {
        code += `${random()}`;
    }
    return code;
}
export default AuthController