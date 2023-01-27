import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../index.js";


const TeacherHour = sequelize.define('teacher_hour', {
    hours: {
        type: DataTypes.JSON,
        allowNull: false
    },
    typeOf: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    status: {
        type: DataTypes.NUMBER,
        allowNull: false
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
    modelName: "TeacherHour",
    tableName: "teacher_hour",
    timestamps: false,
});

export default TeacherHour