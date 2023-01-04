import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const Reservation = sequelize.define('reservation', {
    vehicleTypeId: DataTypes.INTEGER,
    targetDate: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    reason: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,

    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,

    createdBy: DataTypes.DATE,
    updatedBy: DataTypes.DATE,
}, {
    modelName: "Reservation",
    tableName: "reservation",
    timestamps: false
});

export default Reservation