import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../index.js";


const Student_Teacher = sequelize.define('student_teacher', {
  studentId: {
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  teacherId: {
    primaryKey: true,
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
  modelName: "Student_Teacher",
  tableName: "student_teacher",
  timestamps: false,
});

export default Student_Teacher