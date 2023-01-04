import Reservation from './reservation.js';
import Role from './role.js';
import User from './user.js';
import User_Role from './user_role.js';

User.belongsToMany(Role, { through: 'user_role' });
Role.belongsToMany(User, { through: 'user_role' });

export {
    User,
    Role,
    Reservation,
    User_Role
}