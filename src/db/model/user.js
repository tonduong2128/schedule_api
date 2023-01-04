import { DataTypes } from "sequelize";
import bcrypt from "../../util/bcrypt.js";
import sequelize from "../index.js";


const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    set(value) {
      const hash = bcrypt.hash(value);
      this.setDataValue("password", hash);
    },
  },
  fullname: DataTypes.STRING,
  phone: DataTypes.STRING,
  nickname: DataTypes.STRING,
  email: DataTypes.STRING,


  createdBy: DataTypes.INTEGER,
  updatedBy: DataTypes.INTEGER,

  createdBy: DataTypes.DATE,
  updatedBy: DataTypes.DATE,
}, {
  modelName: "User",
  tableName: "user",
  timestamps: false
});

export default User