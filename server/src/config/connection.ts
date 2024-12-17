import "dotenv/config"
import { Sequelize } from "sequelize"

const DB_OPTIONS = {
    DB_NAME: process.env.DB_NAME || "",
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_HOST: process.env.DB_HOST || "",
    DB_PORT: Number(process.env.DB_PORT) || 3306,
}

export default new Sequelize(
    DB_OPTIONS.DB_NAME,
    DB_OPTIONS.DB_USER,
    DB_OPTIONS.DB_PASSWORD,
    {
        host: DB_OPTIONS.DB_HOST,
        port: DB_OPTIONS.DB_PORT,
        dialect: "mysql",
        logging: false
    }
)