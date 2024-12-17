import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class Page extends Model { }

Page.init(
    {
        page_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        page_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        page_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        page_descr: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        page_content: {
            type: DataTypes.TEXT("medium"),
            allowNull: true,
        },
        page_view: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Page",
        tableName: "Pages",
    }
)

export default Page