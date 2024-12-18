import "dotenv/config"
import { Sequelize } from "sequelize"
import vars from "./vars"

export default new Sequelize(
    vars.db_name,
    vars.db_user,
    vars.db_password,
    {
        host: vars.db_host,
        port: vars.db_port,
        dialect: "mysql",
        logging: false
    }
)