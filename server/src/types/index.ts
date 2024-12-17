declare module "express-session" {
    interface SessionData {
        passKey?: string,
        loggedIn?: boolean
    }
}

export interface ParsedEntity {
    entity_id: number,
    entity_name: string,
    entity_content: string,
    entity_image: string,
    entity_date: string,
    entity_type_id: number,
    entity_type_name: string,
    attributes: Record<string, string>,
    taxonomies: Record<string, string[]>
}

export interface Pagination {
    total: number,
    current: number
}

export interface QueryParams {
    s?: string,
    terms?: string,
    per_page?: string,
    page?: string
}