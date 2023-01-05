import Reservation from './reservation.js';
import Role from './role.js';
import User from './user.js';
import User_Role from './user_role.js';
import Vehicle_Type from './vehicle_type.js';

User.belongsToMany(Role, { through: 'user_role', as: "Roles" });
Role.belongsToMany(User, { through: 'user_role', as: "User" });


User.hasMany(Reservation, {
    foreignKey: "createdBy",
    as: "Reservations"
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
export {
    User,
    Role,
    Reservation,
    User_Role,
    Vehicle_Type
}