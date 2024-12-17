import { Request, Response } from "express"
import { Page, Setting } from "../models"

const mainController = {
    get: async (req: Request, res: Response): Promise<any> => {
        try {
            let page: any = await Page.findOne({ where: { page_url: req.path } })
            let params = {
                currentUri: req.path,
                protocol: req.protocol,
                hostname: req.hostname,
                query: req.query
            }

            if (page) {
                page.status = 200
                page.page_view = page.page_view || "page"
            } else {
                const settings404 = await Setting.findAll({ where: { setting_section: "404" } })
                page = settings404.reduce((acc: any, sett: any): object => {
                    let { setting_name, setting_value } = sett
                    acc[setting_name] = setting_value
                    return acc
                }, {})
                page.status = 404
                page.page_view = "404"
            }

            return res.status(page.status).render("main", { page, ...params })
        } catch (e: any) {
            return res.status(500).send(e.message)
        }
    }
}

export default mainController