import path from "path"
import { promises as fs } from "fs"
import { Request, Response } from "express"
import { SitemapStream, streamToPromise, EnumChangefreq } from "sitemap"
import { Page, Setting } from "../../../models"

const sitemapController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "create": {
                    const pages = await Page.findAll({ attributes: ["page_url"] })
                    let page_urls: string[] = []
                    const sitemapSettings = await Setting.findAll({ where: { setting_section: "Sitemap" } })
                    let hostname: string = ""
                    let static_urls: string[] = []

                    pages.forEach((page: any) => page_urls.push(page.page_url))

                    sitemapSettings.forEach((sett: any): void => {
                        let value: string = sett.setting_value ? sett.setting_value.trim() : ""

                        if (sett.setting_name === "domain") hostname = `${req.protocol}://${value}`
                        else if (sett.setting_name === "static_urls") static_urls = value ? value.split(";").filter(v => v !== "") : []
                    })

                    const urls: string[] = Array.from(new Set([...page_urls, ...static_urls]))

                    const sitemapStream = new SitemapStream({ hostname: hostname })
                    urls.forEach((url: string) => {
                        sitemapStream.write({
                            url: url,
                            changefreq: EnumChangefreq.DAILY,
                            priority: 0.5
                        })
                    })
                    sitemapStream.end()

                    const sitemapXML = await streamToPromise(sitemapStream)
                    await fs.writeFile(path.join(process.cwd(), "client/public/sitemap.xml"), sitemapXML, "utf8")

                    return res.status(200).json({ message: "Sitemap created" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    },
}

export default sitemapController