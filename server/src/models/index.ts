import Page from "./Page"
import Setting from "./Setting"
import EntityType from "./EntityType"
import Entity from "./Entity"
import Attribute from "./Attribute"
import AttributeValue from "./AttributeValue"
import Taxonomy from "./Taxonomy"
import TaxonomyTerm from "./TaxonomyTerm"
import EntityTerm from "./EntityTerm"

EntityType.hasMany(Entity, {
    foreignKey: "entity_type_id",
    sourceKey: "entity_type_id",
})
Entity.belongsTo(EntityType, {
    foreignKey: "entity_type_id",
    targetKey: "entity_type_id",
})

EntityType.hasMany(Attribute, {
    foreignKey: "entity_type_id",
    sourceKey: "entity_type_id",
})
Attribute.belongsTo(EntityType, {
    foreignKey: "entity_type_id",
    targetKey: "entity_type_id",
})

EntityType.hasMany(Taxonomy, {
    foreignKey: "entity_type_id",
    sourceKey: "entity_type_id",
})
Taxonomy.belongsTo(EntityType, {
    foreignKey: "entity_type_id",
    targetKey: "entity_type_id",
})

Attribute.hasMany(AttributeValue, {
    foreignKey: "attribute_id",
    sourceKey: "attribute_id",
})
AttributeValue.belongsTo(Attribute, {
    foreignKey: "attribute_id",
    targetKey: "attribute_id",
})

Entity.belongsToMany(Attribute, {
    through: AttributeValue,
    foreignKey: "entity_id",
    otherKey: "attribute_id",
})
Attribute.belongsToMany(Entity, {
    through: AttributeValue,
    foreignKey: "attribute_id",
    otherKey: "entity_id",
})

Taxonomy.hasMany(TaxonomyTerm, {
    foreignKey: "taxonomy_id",
    sourceKey: "taxonomy_id",
})
TaxonomyTerm.belongsTo(Taxonomy, {
    foreignKey: "taxonomy_id",
    targetKey: "taxonomy_id",
})

TaxonomyTerm.hasMany(EntityTerm, {
    foreignKey: "taxonomy_term_id",
    sourceKey: "taxonomy_term_id",
})
EntityTerm.belongsTo(TaxonomyTerm, {
    foreignKey: "taxonomy_term_id",
    targetKey: "taxonomy_term_id",
})

Entity.belongsToMany(TaxonomyTerm, {
    through: EntityTerm,
    foreignKey: "entity_id",
    otherKey: "taxonomy_term_id",
})
TaxonomyTerm.belongsToMany(Entity, {
    through: EntityTerm,
    foreignKey: "taxonomy_term_id",
    otherKey: "entity_id",
})

export { Page, Setting, EntityType, Entity, Attribute, AttributeValue, Taxonomy, TaxonomyTerm, EntityTerm }