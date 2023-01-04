import { DataTypes } from "sequelize";
import sequelize from "../index.js";


const Role = sequelize.define('role', {
  code: DataTypes.STRING,
  name: DataTypes.STRING,
}, {
  modelName: "Role",
  tableName: "role",
  timestamps: false
});

export default Role