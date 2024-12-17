import "dotenv/config"
import { Request, Response, NextFunction } from "express"
import { EntityType, Setting } from "../../models"

const mainController = {
    pass: (req: Request, res: Response, next: NextFunction): any => {
        const key = Object.keys(req.query)[0]
        const passKey = process.env.PASSKEY

        if (req.session.passKey !== passKey && key !== passKey) return res.status(302).redirect("/")

        if (key === passKey) {
            req.session.passKey = key
            req.session.save(() => {
                res.status(302).redirect("/admin")
            })
            return
        }

        return next()
    },
    auth: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]
            const loggedIn = req.session.loggedIn

            if (!loggedIn) {
                const passSetting = await Setting.findOne({ where: { setting_section: "Auth", setting_name: "password" } })
                let page: any = {}

                if (passSetting) {
                    if (key != "login") return res.status(302).redirect("?login")

                    page.page_view = "login"
                    return res.status(200).render("main", { page })
                } else {
                    if (key != "register") return res.status(302).redirect("?register")

                    page.page_view = "register"
                    return res.status(200).render("main", { page })
                }
            }

            return next()
        } catch (e: any) {
            return res.status(500).send(e.message)
        }
    },
    entity: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]
            const value = Object.values(req.query)[0]

            if (key === "entity" && value) {
                const entityType: any = await EntityType.findOne({ where: { entity_type_name: value } })

                if (entityType) {
                    let { entity_type_id, entity_type_name } = entityType
                    let page: any = { page_view: key }
                    let params = {
                        entity_type_id,
                        entity_type_name
                    }

                    return res.status(200).render("main", { page, ...params })
                }
            }

            return next()
        } catch (e: any) {
            return res.status(500).send(e.message)
        }
    },
    get: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]
            const routes = ["dashboard", "pages", "settings"]
            let page: any = {}

            page.status = !key ? 200 : routes.includes(key) ? 200 : 404
            page.page_view = !key ? routes[0] : routes.includes(key) ? key : "404"

            return res.status(page.status).render("main", { page })
        } catch (e: any) {
            return res.status(500).send(e.message)
        }
    }
}

export default mainController