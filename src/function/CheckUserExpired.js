import moment from "moment";
import { Op } from "sequelize";
import { ROLE, STATUS_USER } from "../constant/index.js";
import { Role, Student_Teacher, User } from "../db/model/index.js";


const CheckUserExpired = async () => {
    const users = await User.findAll({
        where: {
            status: STATUS_USER.using,
            dateExpired: { [Op.lt]: moment().format("YYYY-MM-DD") }
        },
        include: [{
            model: Role,
            as: "Roles",
            where: {
                id: {
                    [Op.or]: [ROLE.teacher, ROLE.teacher_vip, ROLE.student]
                }
            },
        }]
    })
    users.forEach(async user => {
        await user.update({
            status: STATUS_USER.exprid
        })
    })
}

export default CheckUserExpired;