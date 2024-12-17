import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class AttributeValue extends Model { }

AttributeValue.init(
    {
        attribute_value_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        entity_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Entities",
                key: "entity_id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        attribute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Attributes",
                key: "attribute_id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "AttributeValue",
        tableName: "AttributeValues",
        indexes: [
            {
                unique: true,
                fields: ["entity_id", "attribute_id"]
            }
        ]
    }
)

export default AttributeValue