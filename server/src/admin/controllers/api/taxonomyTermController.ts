import { Request, Response } from "express"
import { Taxonomy, TaxonomyTerm } from "../../../models"

const taxonomyTermController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "create": {
                    const body: { taxonomy_id: string } = { ...req.body }
                    if (!body.taxonomy_id) return res.status(400).json({ message: "Missing body arguments" })

                    const taxonomy: any = await Taxonomy.findOne({ where: { taxonomy_id: body.taxonomy_id } })
                    if (!taxonomy) return res.status(400).json({ message: "Taxonomy does not exist" })

                    const taxonomyTerm: any = await TaxonomyTerm.create({ taxonomy_id: body.taxonomy_id })
                    let { taxonomy_term_id } = taxonomyTerm

                    return res.status(200).json({ message: "Taxonomy term created", taxonomy_term_id })
                }
                case "delete": {
                    const body: { taxonomy_term_id: string } = { ...req.body }
                    if (!body.taxonomy_term_id) return res.status(400).json({ message: "Missing body arguments" })

                    const taxonomyTerm = await TaxonomyTerm.findOne({ where: { taxonomy_term_id: body.taxonomy_term_id } })
                    if (!taxonomyTerm) return res.status(400).json({ message: "Taxonomy term does not exist" })

                    await taxonomyTerm.destroy()

                    return res.status(200).json({ message: "Taxonomy term deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default taxonomyTermController