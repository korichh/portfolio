import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class Attribute extends Model { }

Attribute.init(
    {
        attribute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        attribute_name: {
            type: DataTypes.STRING,
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
        modelName: "Attribute",
        tableName: "Attributes",
    }
)

export default Attribute