
import { Op } from "sequelize";
import { RESPONSE_CODE, ROLE } from "../constant/index.js";
import { Role, Student_Teacher, User, User_Role } from "../db/model/index.js";
import { response } from "../util/index.js";
const UserComtroller = {
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const userdb = await User.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "Teachers",
                    },
                    {
                        model: User_Role,
                        as: "User_Roles",
                    },
                    {
                        model: Student_Teacher,
                        as: "Students_Teacher",
                    },
                ]
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async search(req, res, next) {
        try {
            const { query } = req;
            const searchOption = JSON.parse(query.searchOption);
            const searchModel = JSON.parse(query.searchModel);
            const searchOther = JSON.parse(query.searchOther);
            const { limit, page } = searchOption;
            const offset = (page - 1) * limit;
            const order = []

            const { teacher, student, teacherId, studentId } = searchOther;
            let queryIncludes = []
            if (teacher) {
                queryIncludes.push({
                    model: Role,
                    as: "Roles",
                    where: {
                        id: {
                            [Op.or]: [ROLE.teacher, ROLE.teacher_vip]
                        }
                    }
                })
            }
            if (student && teacherId) {
                queryIncludes.push({
                    model: Role,
                    as: "Roles",
                    where: {
                        id: ROLE.student
                    },
                }, {
                    model: Student_Teacher,
                    as: "Students_Teacher",
                    where: {
                        teacherId: teacherId
                    },
                })
            }
            if (student && studentId) {
                queryIncludes.push({
                    model: Role,
                    as: "Roles",
                    where: {
                        id: {
                            [Op.or]: [ROLE.teacher, ROLE.teacher_vip]
                        }
                    },
                }, {
                    model: Student_Teacher,
                    as: "Student_Teachers",
                    where: {
                        studentId: studentId
                    },
                })
            }
            const result = await User.findAndCountAll({
                where: {
                    ...searchModel,
                },
                include: [
                    ...queryIncludes,
                    {
                        model: User,
                        as: "CreatedBy",
                    },
                    {
                        model: User,
                        as: "UpdatedBy"
                    }
                ],
                limit,
                offset,
                order,
            })

            const records = result.rows;
            const count = result.count;
            const page_count = Math.ceil(count / limit);
            res.json(response(res, RESPONSE_CODE.SUCCESS, records, count, limit, page, page_count))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async create(req, res, next) {
        try {
            const { _user } = res.locals
            const { body } = req;
            const { user } = body;
            user.createdBy = user.createdBy || _user.id
            const userdb = await User.create(user, {
                include: [{
                    model: User_Role,
                    as: "User_Roles"
                }, {
                    model: Student_Teacher,
                    as: "Students_Teacher"
                }]
            }).then(r => r?.toJSON() || null);
            const records = !!userdb ? [userdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async update(req, res, next) {
        try {
            const { _user } = res.locals;
            const { body } = req;
            const { user } = body;
            delete user.username;
            delete user.password;
            user.updatedBy = _user.id;
            const userIddb = await User.update(user, {
                where: {
                    [Op.or]: [
                        { id: user.id || 0 },
                    ],
                }
            })
            const userdb = await User.findOne({
                where: {
                    id: user.id || 0,
                }
            }).then(r => r?.toJSON() || null)
            const records = !!userdb ? [userdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async updateMany(req, res, next) {
        try {
            const { _user } = res.locals;
            const { body } = req;
            const { userIds, userUpdates } = body;
            userUpdates.updatedBy = _user.id;
            const usersIddb = await User.update(userUpdates, {
                where: {
                    id: {
                        [Op.in]: userIds
                    },
                }
            })
            const usersdb = await User.findAll({
                where: {
                    id: {
                        [Op.in]: userIds
                    }
                }
            }).then(r => r.map(r => r.toJSON()) || [])
            const records = !!usersdb && usersdb.length > 0 ? [usersdb] : [];
            res.json(response(res, RESPONSE_CODE.SUCCESS, records))
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
    async delete(req, res, next) {
        try {
            const { body } = req;
            const { userIds } = body;
            try {
                const usersCountdb = await User.destroy({
                    where: {
                        id: {
                            [Op.in]: userIds
                        }
                    },
                })
                res.json(response(res, RESPONSE_CODE.SUCCESS))
            } catch (error) {
                console.log(error);
                res.json(response(res, RESPONSE_CODE.USER_HAD_USED))
            }
        } catch (error) {
            console.log(error);
            res.json(response(res, RESPONSE_CODE.ERROR_EXTERNAL))
        }
    },
}

export default UserComtroller