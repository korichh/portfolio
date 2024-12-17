import { Request, Response } from "express"
import { EntityType, Attribute } from "../../../models"

const attributeController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "create": {
                    const body: { entity_type_id: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const attribute: any = await Attribute.create({ entity_type_id: body.entity_type_id })
                    let { attribute_id } = attribute

                    return res.status(200).json({ message: "Attribute created", attribute_id })
                }
                case "delete": {
                    const body: { attribute_id: string } = { ...req.body }
                    if (!body.attribute_id) return res.status(400).json({ message: "Missing body arguments" })

                    const attribute = await Attribute.findOne({ where: { attribute_id: body.attribute_id } })
                    if (!attribute) return res.status(400).json({ message: "Attribute does not exist" })

                    await attribute.destroy()

                    return res.status(200).json({ message: "Attribute deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default attributeController