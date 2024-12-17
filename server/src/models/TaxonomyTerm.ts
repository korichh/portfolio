import { Model, DataTypes } from "sequelize"
import sequelize from "../config/connection"

class TaxonomyTerm extends Model { }

TaxonomyTerm.init(
    {
        taxonomy_term_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        taxonomy_term_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        taxonomy_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Taxonomies",
                key: "taxonomy_id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "TaxonomyTerm",
        tableName: "TaxonomyTerms",
    }
)

export default TaxonomyTerm