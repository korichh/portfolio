import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class Taxonomy extends Model { }

Taxonomy.init(
    {
        taxonomy_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        taxonomy_name: {
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
        modelName: "Taxonomy",
        tableName: "Taxonomies",
        indexes: [
            {
                unique: true,
                fields: ["taxonomy_name", "entity_type_id"]
            }
        ]
    }
)

export default Taxonomy