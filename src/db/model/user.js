import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import bcrypt from "../../util/bcrypt.js";
import sequelize from "../index.js";


const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const hash = bcrypt.hash(value);
      this.setDataValue("password", hash);
    },
    allowNull: false,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: DataTypes.STRING,
  email: DataTypes.STRING,

  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },


  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  updatedBy: DataTypes.BIGINT,

  createdDate: {
    type: DataTypes.DATE,
    defaultValue: moment(),
  },
  updatedDate: {
    type: DataTypes.DATE,
  },
}, {
  modelName: "User",
  tableName: "user",
  timestamps: false
});
export default User