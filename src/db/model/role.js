import { DataTypes } from "sequelize";
import sequelize from "../index.js";


const Role = sequelize.define('role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  modelName: "Role",
  tableName: "role",
  timestamps: false
});

export default Role