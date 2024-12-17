import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class EntityType extends Model { }

EntityType.init(
    {
        entity_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        entity_type_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "EntityType",
        tableName: "EntityTypes",
        indexes: [
            {
                unique: true,
                fields: ["entity_type_name"]
            }
        ]
    }
)

export default EntityType