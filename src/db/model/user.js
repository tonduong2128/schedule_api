"use strict";
import { Model } from "sequelize";
import bcrypt from "../../util";

export default (sequelize, DataTypes) => {
  class UserModel extends Model {
    static associate(models) {
      this.belongsToMany(models.Roles, {
        through: "user_role",
        onUpdate: "cascade",
      });
    }
  }
  UserModel.init(
    {
      username: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(value) {
          const hash = bcrypt.hash(value);
          this.setDataValue("password", hash);
        },
      },
      fullname: DataTypes.STRING,
      phone: DataTypes.STRING,
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return UserModel;
};
