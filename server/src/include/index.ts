import path from "path"
import sequelize from "../config/connection"
import { Op } from "sequelize"
import { EntityType, Entity, Attribute, Taxonomy, TaxonomyTerm } from "../models"
import { ParsedEntity, Pagination, QueryParams } from "../types"

export function parseEntity(entity: any): ParsedEntity | null {
    if (!entity) return null

    const parsedEntity: ParsedEntity = {
        entity_id: entity.entity_id,
        entity_name: entity.entity_name,
        entity_content: entity.entity_content,
        entity_image: entity.entity_image,
        entity_date: entity.entity_date,
        entity_type_id: entity.entity_type_id,
        entity_type_name: entity.EntityType.entity_type_name,
        attributes: {},
        taxonomies: {}
    }

    entity.Attributes.forEach((attr: any): void => {
        parsedEntity.attributes[attr.attribute_name] = attr.AttributeValue.attribute_value_text
    })

    entity.TaxonomyTerms.forEach((term: any): void => {
        if (!parsedEntity.taxonomies[term.Taxonomy.taxonomy_name]) parsedEntity.taxonomies[term.Taxonomy.taxonomy_name] = []
        parsedEntity.taxonomies[term.Taxonomy.taxonomy_name].push(term.taxonomy_term_name)
    })

    return parsedEntity
}

export function escapeHTML(html: string): string {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
} 

export function isJSON(str: string, type: string): boolean {
    try {
        const value = JSON.parse(str)
        switch (type) {
            case "array":
                if (!Array.isArray(value)) throw new Error()
                break
            case "object":
                if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error()
                break
        }
    } catch (e) {
        return false
    }
    return true
}

export function capital(text: string): string {
    return text[0].toUpperCase() + text.slice(1)
}

export function getImageSrc(entity: any, size: string = ""): string {
    if (!entity.entity_image) return "#"
    switch (size) {
        case "sm":
            let { name, ext } = path.parse(entity.entity_image)
            entity.entity_image = `${name}-${size}${ext}`
            break
    }
    return `img/entity-type/${entity.entity_type_name}/${entity.entity_image}`
}

export async function getEntities(entity_type_name: string, query: QueryParams): Promise<[(ParsedEntity | null)[], Pagination] | [[], null]> {
    try {
        const searchTerm = query.s || ""
        const terms = query.terms && isJSON(query.terms, "array") ? JSON.parse(query.terms) : []

        const whereClause: any = {
            entity_name: {
                [Op.substring]: searchTerm
            }
        }

        if (terms.length > 0) {
            whereClause.entity_id = {
                [Op.in]: sequelize.literal(`(SELECT e.entity_id FROM Entities e JOIN EntityTerms et ON e.entity_id = et.entity_id WHERE et.taxonomy_term_id IN (${sequelize.escape(terms)}) GROUP BY e.entity_id HAVING COUNT(DISTINCT et.taxonomy_term_id) = ${sequelize.escape(terms.length)})`)
            }
        }

        const totalCount = await Entity.count({
            include: [{
                model: EntityType,
                where: { entity_type_name }
            }],
            where: whereClause,
        })

        const perPage = Math.max(Number(query.per_page) || 9, 1)
        const totalPages = Math.ceil(totalCount / perPage)
        const currentPage = Math.min(Math.max(Number(query.page) || 1, 1), totalPages)
        const offset = (currentPage - 1) * perPage

        const entities = await Entity.findAll({
            include: [{
                model: EntityType,
                where: { entity_type_name }
            }, {
                model: Attribute,
            }, {
                model: TaxonomyTerm,
                include: [{
                    model: Taxonomy
                }]
            }],
            where: whereClause,
            limit: perPage,
            offset: offset,
            order: [["entity_id", "desc"]]
        })

        const parsedEntities: (ParsedEntity | null)[] = entities.map((entity: any): ParsedEntity | null => parseEntity(entity))

        const pagination: Pagination = {
            total: totalPages,
            current: currentPage,
        }

        return [parsedEntities, pagination]
    } catch (e) {
        return [[], null]
    }
}

export async function getEntity(entity_id: string): Promise<ParsedEntity | null> {
    try {
        let entity = await Entity.findOne({
            include: [{
                model: EntityType,
            }, {
                model: Attribute,
            }, {
                model: TaxonomyTerm,
                include: [{
                    model: Taxonomy
                }]
            }],
            where: { entity_id }
        })

        return parseEntity(entity)
    } catch (e) {
        return null
    }
}

export async function getTaxonomies(entity_type_name: string): Promise<object[] | []> {
    try {
        const taxonomies = await Taxonomy.findAll({
            include: [{
                model: EntityType,
                where: { entity_type_name }
            }, {
                model: TaxonomyTerm,
            }],
            order: [["taxonomy_id", "asc"]]
        })

        return taxonomies
    } catch (e) {
        return []
    }
}