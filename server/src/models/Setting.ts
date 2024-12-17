import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class Setting extends Model { }

Setting.init(
    {
        setting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        setting_section: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        setting_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        setting_value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Setting",
        tableName: "Settings",
        indexes: [
            {
                unique: true,
                fields: ["setting_section", "setting_name"]
            }
        ]
    }
)

export default Setting