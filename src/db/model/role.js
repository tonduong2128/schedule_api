"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RolesModel extends Model {
    static associate(models) {
      this.belongsToMany(models.Users, {
        through: "user_role",
        onUpdate: "cascade",
      });
    }
  }
  RolesModel.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      desciption: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return RolesModel;
};
