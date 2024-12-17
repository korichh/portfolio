import path from "path"
import { promises as fs } from "fs"
import { Page, Setting, EntityType, Entity, Attribute, AttributeValue, Taxonomy, TaxonomyTerm, EntityTerm } from "../../models"

export async function fsAccess(path: string): Promise<boolean> {
    try {
        await fs.access(path)
    } catch (e) {
        return false
    }
    return true
}

export function getUploadDir(...paths: string[]): string {
    return path.join(process.cwd(), "client/public/img/upload", ...paths)
}

export function getEntityImageDir(...paths: string[]): string {
    return path.join(process.cwd(), "client/public/img/entity-type", ...paths)
}

export function trunc(text: string | number | null, size: number = 20): string {
    if (!text) return "-"
    if (typeof text === 'number') text = String(text)
    return text.length <= size ? text : `${text.slice(0, size)}...`
}

export function capital(text: string | number | null): string {
    if (!text) return ""
    if (typeof text === 'number') text = String(text)
    return text[0].toUpperCase() + text.slice(1)
}

export const formatDate = (dateStr: string | number | null): string => {
    if (!dateStr) return ""
    if (typeof dateStr === 'number') dateStr = String(dateStr)
    const date = new Date(dateStr)
    return date.toLocaleString("en", { year: "numeric", month: "short", day: "numeric" })
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

export async function getSettings(): Promise<object | null> {
    try {
        const settings = await Setting.findAll({ order: [["setting_id", "asc"]] })

        return settings.reduce((acc: any, sett: any): object => {
            let { setting_section } = sett
            if (!acc[setting_section]) acc[setting_section] = []
            acc[setting_section].push(sett)
            return acc
        }, {})
    } catch (e) {
        return null
    }
}

export async function getSetting(setting_name: string): Promise<object | null> {
    try {
        const setting = await Setting.findOne({
            where: { setting_name }
        })

        return setting
    } catch (e) {
        return null
    }
}

export async function getPages(): Promise<object[] | []> {
    try {
        const pages = await Page.findAll({ order: [["page_id", "asc"]] })

        return pages
    } catch (e) {
        return []
    }
}

export async function getPage(page_id: string): Promise<object | null> {
    try {
        const page = await Page.findOne({
            where: { page_id }
        })

        return page
    } catch (e) {
        return null
    }
}

export async function getEntityTypes(): Promise<object[] | []> {
    try {
        const entityTypes = await EntityType.findAll({
            include: [{
                model: Attribute,
                required: false,
            }],
            order: [["entity_type_id", "asc"]]
        })

        return entityTypes
    } catch (e) {
        return []
    }
}

export async function getEntityType(entity_type_id: string): Promise<object | null> {
    try {
        const entityType = await EntityType.findOne({
            include: [{
                model: Attribute,
                required: false,
            }],
            where: { entity_type_id }
        })

        return entityType
    } catch (e) {
        return null
    }
}

export async function getEntities(entity_type_id: string): Promise<object[] | []> {
    try {
        const entities = await Entity.findAll({
            where: { entity_type_id },
            order: [["entity_id", "asc"]]
        })

        return entities
    } catch (e) {
        return []
    }
}

export async function getEntity(entity_id: string): Promise<object | null> {
    try {
        const entity = await Entity.findOne({
            include: [{
                model: EntityType,
                include: [{
                    model: Attribute,
                    include: [{
                        model: AttributeValue,
                        where: { entity_id },
                        required: false,
                    }],
                }, {
                    model: Taxonomy,
                    include: [{
                        model: TaxonomyTerm,
                        include: [{
                            model: EntityTerm,
                            where: { entity_id },
                            required: false,
                        }],
                    }],
                }],
            }],
            where: { entity_id }
        })

        return entity
    } catch (e) {
        return null
    }
}

export async function getTaxonomies(entity_type_id: string): Promise<object[] | []> {
    try {
        const taxonomies = await Taxonomy.findAll({
            include: [{
                model: TaxonomyTerm,
                required: false
            }],
            where: { entity_type_id },
            order: [["taxonomy_id", "asc"]]
        })

        return taxonomies
    } catch (e) {
        return []
    }
}

export async function getTaxonomy(taxonomy_id: string): Promise<object | null> {
    try {
        const taxonomy = await Taxonomy.findOne({
            include: [{
                model: TaxonomyTerm,
                required: false
            }],
            where: { taxonomy_id }
        })

        return taxonomy
    } catch (e) {
        return null
    }
}