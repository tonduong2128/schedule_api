import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const Reservation = sequelize.define('reservation', {
    vehicleTypeId: DataTypes.INTEGER,
    targetDate: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    reason: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,

    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,

    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
}, {
    modelName: "Reservation",
    tableName: "reservation",
    timestamps: false
});

export default Reservation