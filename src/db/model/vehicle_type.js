import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../index.js";


const VehicleType = sequelize.define('vehicle_type', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,

    teacherId: {
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
    modelName: "VehicleType",
    tableName: "vehicle_type",
    timestamps: false,
});

export default VehicleType