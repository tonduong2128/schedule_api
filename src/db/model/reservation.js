"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ReservationModel extends Model {
        static associate(models) {
        }
    }
    ReservationModel.init(
        {
            vehicleTypeId: DataTypes.INTEGER,
            targetDate: DataTypes.DATE,
            startTime: DataTypes.TIME,
            endTime: DataTypes.TIME,
            reason: DataTypes.STRING,
            teacherId: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
            createdBy: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Reservation",
        }
    );
    return ReservationModel;
};
