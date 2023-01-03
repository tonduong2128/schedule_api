"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Role extends Model {
    static associate(models) {

    }
  }
  users_rolesModel.init(
    {
      roleId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Role",
    }
  );
  return User_Role;
};
