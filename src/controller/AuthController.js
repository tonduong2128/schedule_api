
import jwt from "jsonwebtoken";
import moment from "moment";
import { publicIpv4 } from "public-ip";
import { Op } from "sequelize";
import { PASSWORD_DEFAULT, RESPONSE_CODE, ROLE, STATUS_USER } from "../constant/index.js";
import { Role, User } from "../db/model/index.js";
import Otp_Record from "../db/model/otp_record.js";
import { MailService } from "../service/index.js";
import { bcrypt, response } from "../util/index.js";


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
            const roleIds = userdb.Roles.map(r => r.id);
            const matchPassword = bcrypt.compare(user.password, userdb.password)
            if (matchPassword) {
                console.log(userdb.status);
                console.log(roleIds);
                console.log(userdb.dateExpired);
                console.log(moment().format("YYYY-MM-DD"));

                if (userdb.status === STATUS_USER.exprid || (!roleIds.includes(ROLE.admin) && userdb.dateExpired < moment().format("YYYY-MM-DD"))) {
                    return res.json(response(res, RESPONSE_CODE.USER_EXPIRED))
                }
                const token = jwt.sign(userdb, process.env.SECRET_KEY, { expiresIn: "7d" });
                const newResponse = response(res, RESPONSE_CODE.SUCCESS);
                newResponse.token = token
                res.json(newResponse);
            } else {
                res.json(response(res, RESPONSE_CODE.ERROR))
            }
        } catch (error) {
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
            if (!_user && !userdb && !_user.Roles.some(r => r.id === ROLE.admin || r.id === ROLE.teacher || r.id === ROLE.teacher_vip)) {
                res.json(response(res, RESPONSE_CODE.NO_PERMISSION))
            }
            await userdb.update({
                password: PASSWORD_DEFAULT,
                updatedBy: _user.id,
                updatedDate: moment()
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
                            used: true,
                            updatedDate: moment(),
                        })
                        await userdb.update({
                            password,
                            updatedBy: userdb.id,
                            updatedDate: moment(),
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
                    passowrd: newPassword,
                    updatedBy: _user.id,
                    updatedDate: moment(),
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