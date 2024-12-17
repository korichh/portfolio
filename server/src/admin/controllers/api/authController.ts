import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { Setting } from "../../../models"

const authController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "register": {
                    const body: { password: string } = { ...req.body }
                    if (!body.password) return res.status(400).json({ message: "Missing body arguments" })

                    const passSetting = await Setting.findOne({ where: { setting_section: "Auth", setting_name: "password" } })
                    if (passSetting) return res.status(400).json({ message: "Password exists" })

                    const passHash = await bcrypt.hash(body.password, 12)
                    await Setting.create({ setting_section: "Auth", setting_name: "password", setting_value: passHash })

                    await Setting.create({ setting_section: "404", setting_name: "page_title" })
                    await Setting.create({ setting_section: "404", setting_name: "page_descr" })
                    await Setting.create({ setting_section: "Sitemap", setting_name: "domain" })
                    await Setting.create({ setting_section: "Sitemap", setting_name: "static_urls" })

                    return res.status(200).json({ message: "Password created" })
                }
                case "login": {
                    const body: { password: string } = { ...req.body }
                    if (!body.password) return res.status(400).json({ message: "Missing body arguments" })

                    const passSetting: any = await Setting.findOne({ where: { setting_section: "Auth", setting_name: "password" } })
                    if (!passSetting) return res.status(400).json({ message: "Password does not exist" })

                    const passMatch = await bcrypt.compare(body.password, passSetting.setting_value)
                    if (passMatch) {
                        req.session.loggedIn = true
                        req.session.save()
                        return res.status(200).json({ message: "Logged In" })
                    } else return res.status(400).json({ message: "Wrong password" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    },
}

export default authController