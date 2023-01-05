import { DataTypes } from "sequelize";
import sequelize from "../index.js";


const VehicleType = sequelize.define('vehicle_type', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,


    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,

    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
}, {
    modelName: "VehicleType",
    tableName: "vehicle_type",
    timestamps: false
});

export default VehicleType