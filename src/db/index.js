import { Op, Sequelize } from "sequelize";
import config from "../config/database.js";

const realConfig = config[process.env.NODE_ENV || "development"]
const sequelize = new Sequelize(
    realConfig.database,
    realConfig.username,
    realConfig.password,
    {
        ...realConfig,
        operatorsAliases: {
            $in: Op.in,
            $or: Op.or,
            $ne: Op.ne,
            $and: Op.and,
            $like: Op.like,
            $between: Op.between
        }
    }
)
export default sequelize
