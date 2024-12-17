import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class Entity extends Model { }

Entity.init(
    {
        entity_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        entity_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        entity_content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        entity_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        entity_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        entity_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "EntityTypes",
                key: "entity_type_id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Entity",
        tableName: "Entities",
    }
)

export default Entity