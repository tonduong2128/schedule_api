import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../index.js";


const User_Role = sequelize.define('user_role', {
  roleId: {
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  userId: {
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  updatedBy: DataTypes.BIGINT,

  createdDate: {
    type: DataTypes.DATE,
    defaultValue: moment()
  },
  updatedDate: {
    type: DataTypes.DATE,
  },
}, {
  modelName: "User_Role",
  tableName: "user_role",
  timestamps: false
});

export default User_Role