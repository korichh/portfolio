import { Request, Response } from "express"

const entityController = {
    api: (req: Request, res: Response): any => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "item_html": {
                    const body: { entity_type_name: string, entity_id: string } = { ...req.body }
                    if (!body.entity_type_name || !body.entity_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render(`partials/${body.entity_type_name}/item`, { entity_id: body.entity_id }, (e, item_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Entity item html", item_html })
                    })
                }
                case "list_html": {
                    const body: { entity_type_name: string, query: string } = { ...req.body }
                    if (!body.entity_type_name || !body.query) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render(`partials/${body.entity_type_name}/list`, { entity_type_name: body.entity_type_name, query: JSON.parse(body.query) }, (e, list_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Entities list html", list_html })
                    })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default entityController