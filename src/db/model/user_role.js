import { DataTypes } from "sequelize";
import sequelize from "../index.js";


const User_Role = sequelize.define('user_role', {
  roleId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
}, {
  modelName: "User_Role",
  tableName: "user_role",
  timestamps: false
});

export default User_Role