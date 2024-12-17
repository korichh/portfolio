import { Request, Response } from "express"
import { EntityType, Taxonomy, TaxonomyTerm } from "../../../models"

const taxonomyController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "table_html": {
                    const body: { entity_type_id: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/taxonomy/table", { entity_type_id: body.entity_type_id }, (e, table_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Taxonomies table html", table_html })
                    })
                }
                case "edit_html": {
                    const body: { entity_type_id: string, taxonomy_id: string } = { ...req.body }
                    if (!body.entity_type_id || !body.taxonomy_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/taxonomy/edit", { entity_type_id: body.entity_type_id, taxonomy_id: body.taxonomy_id }, (e, edit_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Edit taxonomy html", edit_html })
                    })
                }
                case "create": {
                    const body: { entity_type_id: string } = { ...req.body }
                    if (!body.entity_type_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const taxonomy: any = await Taxonomy.create({ entity_type_id: body.entity_type_id })
                    let { taxonomy_id } = taxonomy

                    return res.status(200).json({ message: "Taxonomy created", taxonomy_id })
                }
                case "edit": {
                    const body: { entity_type_id: string, taxonomy_id: string, taxonomy_name?: string, taxonomy_terms?: string } = { ...req.body }
                    if (!body.entity_type_id || !body.taxonomy_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const taxonomy: any = await Taxonomy.findOne({ where: { taxonomy_id: body.taxonomy_id } })
                    if (!taxonomy) return res.status(400).json({ message: "Taxonomy does not exist" })

                    body.taxonomy_name = body.taxonomy_name ? String(body.taxonomy_name).trim() : ""
                    let old_taxonomy_name = taxonomy.taxonomy_name ? String(taxonomy.taxonomy_name).trim() : ""

                    if (body.taxonomy_name && body.taxonomy_name !== old_taxonomy_name && await Taxonomy.findOne({ where: { taxonomy_name: body.taxonomy_name, entity_type_id: body.entity_type_id } })) return res.status(400).json({ message: "Taxonomy exists" })

                    if (body.taxonomy_terms)
                        for (const [taxonomy_term_id, taxonomy_term_name] of JSON.parse(body.taxonomy_terms)) {
                            const taxonomyTerm = await TaxonomyTerm.findOne({ where: { taxonomy_term_id } })
                            if (!taxonomyTerm) continue

                            taxonomyTerm.update({ taxonomy_term_name })
                        }

                    await taxonomy.update({ taxonomy_name: body.taxonomy_name })

                    return res.status(200).json({ message: "Taxonomy edited" })
                }
                case "delete": {
                    const body: { entity_type_id: string, taxonomy_id: string } = { ...req.body }
                    if (!body.entity_type_id || !body.taxonomy_id) return res.status(400).json({ message: "Missing body arguments" })

                    const entityType: any = await EntityType.findOne({ where: { entity_type_id: body.entity_type_id } })
                    if (!entityType) return res.status(400).json({ message: "Entity type does not exist" })

                    const taxonomy = await Taxonomy.findOne({ where: { taxonomy_id: body.taxonomy_id } })
                    if (!taxonomy) return res.status(400).json({ message: "Taxonomy does not exist" })

                    await taxonomy.destroy()

                    return res.status(200).json({ message: "Taxonomy deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default taxonomyController