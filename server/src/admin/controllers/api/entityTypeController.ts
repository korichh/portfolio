import { promises as fs } from "fs"
import { Request, Response } from "express"
import { EntityType, Attribute } from "../../../models"
import { fsAccess, getEntityImageDir } from "../../include"

const entityTypeController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "table_html": {
                    return res.render("partials/entity-type/table", {}, (e, table_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Entity types table html", table_html })
                    })
                }
                case "edit_html": {
                    const body: { entity_type_id: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/entity-type/edit", { entity_type_id: body.entity_type_id }, (e, edit_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Edit entity type html", edit_html })
                    })
                }
                case "items_html": {
                    return res.render("partials/entity-type/items", {}, (e, items_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Entity type items html", items_html })
                    })
                }
                case "create": {
                    const entityType: any = await EntityType.create()
                    let { entity_type_id } = entityType

                    return res.status(200).json({ message: "Entity type created", entity_type_id })
                }
                case "edit": {
                    const body: { entity_type_id: string, entity_type_name?: string, attributes?: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    body.entity_type_name = body.entity_type_name ? String(body.entity_type_name).trim() : ""
                    let old_entity_type_name = entityType.entity_type_name ? String(entityType.entity_type_name).trim() : ""
                    const destPath = getEntityImageDir(body.entity_type_name)
                    const oldPath = getEntityImageDir(old_entity_type_name)

                    if (body.entity_type_name) {
                        if (body.entity_type_name !== old_entity_type_name && await EntityType.findOne({ where: { entity_type_name: body.entity_type_name } })) return res.status(400).json({ message: "Entity type exists" })

                        if (old_entity_type_name && body.entity_type_name !== old_entity_type_name) {
                            if (await fsAccess(oldPath)) await fs.rename(oldPath, destPath)
                        } else if (!old_entity_type_name) {
                            if (!await fsAccess(destPath)) await fs.mkdir(destPath, { recursive: true })
                        }
                    } else if (old_entity_type_name) {
                        if (await fsAccess(oldPath)) await fs.rm(oldPath, { recursive: true })
                    }

                    if (body.attributes)
                        for (const [attribute_id, attribute_name] of JSON.parse(body.attributes)) {
                            const attribute = await Attribute.findOne({ where: { attribute_id } })
                            if (!attribute) continue

                            attribute.update({ attribute_name })
                        }

                    await entityType.update({ entity_type_name: body.entity_type_name })

                    return res.status(200).json({ message: "Entity type edited" })
                }
                case "delete": {
                    const body: { entity_type_id: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    let entity_type_name = entityType.entity_type_name ? String(entityType.entity_type_name).trim() : ""
                    const destPath = getEntityImageDir(entity_type_name)

                    if (entity_type_name) {
                        if (await fsAccess(destPath)) await fs.rm(destPath, { recursive: true })
                    }

                    await entityType.destroy()

                    return res.status(200).json({ message: "Entity type deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default entityTypeController