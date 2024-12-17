import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { Setting } from "../../../models"
import { isJSON } from "../../include"

const settingController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "edit": {
                    const body: { settings: string } = { ...req.body }
                    if (!body.settings) return res.status(400).json({ message: "Missing body arguments" })

                    if (!isJSON(body.settings, "array")) return res.status(400).json({ message: "Invalid body arguments" })

                    for (let [key, setting_value] of JSON.parse(body.settings)) {
                        let [setting_id, setting_name] = key.split("|")
                        if (setting_name === "password") {
                            if (setting_value === "") continue
                            else setting_value = await bcrypt.hash(setting_value, 12)
                        }

                        const setting = await Setting.findOne({ where: { setting_id } })
                        if (!setting) continue

                        await setting.update({ setting_value })
                    }

                    return res.status(200).json({ message: "Settings updated" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    },
}

export default settingController