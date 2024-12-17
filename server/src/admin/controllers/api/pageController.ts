import { Request, Response } from "express"
import { Page } from "../../../models"

const pageController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "table_html": {
                    return res.render("partials/page/table", {}, (e, table_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Pages table html", table_html })
                    })
                }
                case "edit_html": {
                    const body: { page_id: string } = { ...req.body }
                    if (!body.page_id) return res.status(400).json({ message: "Missing body arguments" })

                    return res.render("partials/page/edit", { page_id: body.page_id }, (e, edit_html) => {
                        if (e) throw e
                        else return res.status(200).json({ message: "Edit page html", edit_html })
                    })
                }
                case "create": {
                    const page: any = await Page.create()
                    let { page_id } = page

                    return res.status(200).json({ message: "Page created", page_id })
                }
                case "edit": {
                    const body: { page_id: string, page_url?: string, page_title?: string, page_descr?: string, page_content?: string, page_view?: string } = { ...req.body }
                    if (!body.page_id) return res.status(400).json({ message: "Missing body arguments" })

                    const page = await Page.findOne({ where: { page_id: body.page_id } })
                    if (!page) return res.status(400).json({ message: "Page does not exist" })

                    await page.update({ page_url: body.page_url, page_title: body.page_title, page_descr: body.page_descr, page_content: body.page_content, page_view: body.page_view })

                    return res.status(200).json({ message: "Page edited" })
                }
                case "delete": {
                    const body: { page_id: string } = { ...req.body }
                    if (!body.page_id) return res.status(400).json({ message: "Missing body arguments" })

                    const page = await Page.findOne({ where: { page_id: body.page_id } })
                    if (!page) return res.status(400).json({ message: "Page does not exist" })

                    await page.destroy()

                    return res.status(200).json({ message: "Page deleted" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default pageController