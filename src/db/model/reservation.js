import moment from "moment/moment.js";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../index.js";

const Reservation = sequelize.define('reservation', {
    vehicleTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    targetDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    reason: DataTypes.STRING,
    teacherId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    studentId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: DataTypes.INTEGER,

    createdBy: {
        type: DataTypes.BIGINT,
        allowNull: false
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
    modelName: "Reservation",
    tableName: "reservation",
    timestamps: false
});

export default Reservation