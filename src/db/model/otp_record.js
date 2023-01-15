import { DataTypes } from "sequelize";
import sequelize from "../index.js";


const Otp_Record = sequelize.define('otp_record', {
    code: {
        type: DataTypes.STRING,
        defaultValue: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    updatedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
    }
}, {
    modelName: "Otp_Record",
    tableName: "otp_record",
    timestamps: false,
});

export default Otp_Record