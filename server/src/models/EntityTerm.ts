import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class EntityTerm extends Model { }

EntityTerm.init(
    {
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
        taxonomy_term_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "TaxonomyTerms",
                key: "taxonomy_term_id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "EntityTerm",
        tableName: "EntityTerms",
        indexes: [
            {
                unique: true,
                fields: ["entity_id", "taxonomy_term_id"]
            }
        ]
    }
)

export default EntityTerm