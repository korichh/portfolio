import path from "path"
import { promises as fs } from "fs"
import { Request, Response } from "express"
import sharp from "sharp"
import { EntityType, Entity, AttributeValue, EntityTerm } from "../../../models"
import { fsAccess, getEntityImageDir } from "../../include"

const entityController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "table_html": {
                    const body: { entity_type_id: string, entity_type_name: string } = { ...req.body }
                    if (!body.entity_type_id || !body.entity_type_name) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/entity/table", { entity_type_id: body.entity_type_id, entity_type_name: body.entity_type_name }, (e, table_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Entities table html", table_html })
                    })
                }
                case "edit_html": {
                    const body: { entity_type_id: string, entity_type_name: string, entity_id: string } = { ...req.body }
                    if (!body.entity_type_id || !body.entity_type_name || !body.entity_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/entity/edit", { entity_type_id: body.entity_type_id, entity_type_name: body.entity_type_name, entity_id: body.entity_id }, (e, edit_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Edit entity html", edit_html })
                    })
                }
                case "create": {
                    const body: { entity_type_id: string, entity_type_name: string } = { ...req.body }
                    if (!body.entity_type_id || !body.entity_type_name) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const entity: any = await Entity.create({ entity_type_id: body.entity_type_id })
                    let { entity_id } = entity

                    return res.status(200).json({ message: "Entity created", entity_id })
                }
                case "edit": {
                    const body: { entity_type_id: string, entity_type_name: string, entity_id: string, entity_image_modified: string, entity_image?: string, entity_name?: string, entity_content?: string, entity_date?: string, attributes?: string, taxonomy_terms?: string } = { ...req.body }
                    if (!body.entity_type_id || !body.entity_type_name || !body.entity_id || !body.entity_image_modified) return res.status(400).json({ message: "Missing body arguments" })

                    if (isNaN(Number(body.entity_image_modified))) return res.status(400).json({ message: "Invalid body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const entity: any = await Entity.findOne({ where: { entity_id: body.entity_id } })
                    if (!entity) return res.status(400).json({ message: "Entity does not exist" })

                    body.entity_type_name = body.entity_type_name ? String(body.entity_type_name).trim() : ""
                    const destPath = getEntityImageDir(body.entity_type_name)

                    if (body.entity_type_name && Number(body.entity_image_modified)) {
                        if (entity.entity_image) {
                            if (await fsAccess(destPath)) {
                                let { name, ext } = path.parse(entity.entity_image)

                                await fs.rm(path.join(destPath, entity.entity_image))
                                await fs.rm(path.join(destPath, `${name}-sm${ext}`))
                            }
                        }

                        if (req.file) {
                            if (await fsAccess(destPath)) {
                                let { name, ext } = path.parse(req.file.filename)

                                await fs.copyFile(req.file.path, path.join(destPath, `${name}${ext}`))
                                await sharp(req.file.path)
                                    .resize({ width: 600, height: 600, fit: "cover" })
                                    .toFile(path.join(destPath, `${name}-sm${ext}`))

                                body.entity_image = req.file.filename
                            }
                        } else body.entity_image = ""
                    } else body.entity_image = entity.entity_image

                    if (body.attributes)
                        for (const [attribute_id, attribute_value_text] of JSON.parse(body.attributes)) {
                            const attributeValue = await AttributeValue.findOne({ where: { attribute_id, entity_id: body.entity_id } })
                            if (attributeValue) await attributeValue.update({ attribute_value_text })
                            else await AttributeValue.create({ attribute_value_text, attribute_id, entity_id: body.entity_id })
                        }

                    if (body.taxonomy_terms)
                        for (const [taxonomy_term_id, state] of JSON.parse(body.taxonomy_terms)) {
                            const entityTerm = await EntityTerm.findOne({ where: { taxonomy_term_id, entity_id: body.entity_id } })
                            switch (state) {
                                case "on":
                                    if (!entityTerm) await EntityTerm.create({ taxonomy_term_id, entity_id: body.entity_id })
                                    break
                                case "off":
                                    if (entityTerm) await entityTerm.destroy()
                                    break
                            }
                        }

                    await entity.update({ entity_name: body.entity_name, entity_content: body.entity_content, entity_image: body.entity_image, entity_date: body.entity_date })

                    return res.status(200).json({ message: "Entity edited" })
                }
                case "delete": {
                    const body: { entity_type_id: string, entity_type_name: string, entity_id: string } = { ...req.body }
                    if (!body.entity_type_id || !body.entity_type_name || !body.entity_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const entity: any = await Entity.findOne({ where: { entity_id: body.entity_id } })
                    if (!entity) return res.status(400).json({ message: "Entity does not exist" })

                    body.entity_type_name = body.entity_type_name ? String(body.entity_type_name).trim() : ""
                    const destPath = getEntityImageDir(body.entity_type_name)

                    if (body.entity_type_name && entity.entity_image) {
                        if (await fsAccess(destPath)) {
                            let { name, ext } = path.parse(entity.entity_image)

                            await fs.rm(path.join(destPath, entity.entity_image))
                            await fs.rm(path.join(destPath, `${name}-sm${ext}`))
                        }
                    }

                    await entity.destroy()

                    return res.status(200).json({ message: "Entity deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default entityController