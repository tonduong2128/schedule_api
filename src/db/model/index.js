import Reservation from './reservation.js';
import Role from './role.js';
import Student_Teacher from './student_teacher.js';
import User from './user.js';
import User_Role from './user_role.js';
import Vehicle_Type from './vehicle_type.js';

User.belongsToMany(Role, { through: 'user_role', as: "Roles", foreignKey: "userId", timestamps: false });
Role.belongsToMany(User, { through: 'user_role', as: "Users", foreignKey: "roleId", timestamps: false });

User.belongsToMany(User, { through: 'student_teacher', as: "Teachers", foreignKey: "studentId", timestamps: false });
User.belongsToMany(User, { through: 'student_teacher', as: "Students", foreignKey: "teacherId", timestamps: false });

User.hasMany(Student_Teacher, { as: "Student_Teachers", foreignKey: "teacherId" });
User.hasMany(Student_Teacher, { as: "Students_Teacher", foreignKey: "studentId" });

User.belongsTo(User, { as: "UpdatedBy", foreignKey: "updatedBy" });
User.belongsTo(User, { as: "CreatedBy", foreignKey: "createdBy" });


User.hasMany(User_Role, {
    foreignKey: "userId",
    as: "User_Roles",
})

User.hasMany(Reservation, {
    foreignKey: "createdBy",
    as: "Reservations"
})
Reservation.belongsTo(User, {
    foreignKey: "studentId",
    as: "Student",
})
Reservation.belongsTo(User, {
    foreignKey: "createdBy",
    as: "CreatedBy",
})
Reservation.belongsTo(User, {
    foreignKey: "updatedBy",
    as: "UpdatedBy",
})
Reservation.belongsTo(User, {
    foreignKey: "teacherId",
    as: "Teacher",
})
Reservation.belongsTo(Vehicle_Type, {
    foreignKey: "vehicleTypeId",
    as: "VehicleType",
})
Vehicle_Type.belongsTo(User, {
    foreignKey: "teacherId",
    as: "Teacher",
})
Vehicle_Type.belongsTo(User, {
    foreignKey: "createdBy",
    as: "CreatedBy",
})
Vehicle_Type.belongsTo(User, {
    foreignKey: "updatedBy",
    as: "UpdatedBy",
})
export {
    User,
    Role,
    Reservation,
    User_Role,
    Vehicle_Type,
    Student_Teacher
}