import "dotenv/config"
import { Request, Response } from "express"
import axios from "axios"
import { escapeHTML } from "../../include"
import vars from "../../config/vars"

const contactController = {
    api: async (req: Request, res: Response): Promise<any> => {
        try {
            const key = Object.keys(req.query)[0]

            switch (key) {
                case "send_message": {
                    const body: { name: string, email: string, message: string } = { ...req.body }
                    if (!body.name || !body.email || !body.message) return res.status(400).json({ message: "Missing body arguments" })

                    const TELEGRAM_BOT_TOKEN = vars.telegram_bot_token
                    const TELEGRAM_CHAT_ID = vars.telegram_chat_id
                    const messageText = `💬 New message from <b>${escapeHTML(body.name)} - ${escapeHTML(body.email)}</b>\n\n${escapeHTML(body.message)}`

                    const response = await axios(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: "post",
                        data: {
                            chat_id: TELEGRAM_CHAT_ID,
                            text: messageText,
                            parse_mode: "HTML"
                        },
                    })

                    if (response.data.ok) return res.status(200).json({ message: "Message was sent" })
                }
            }

            return res.status(400).json({ message: "Bad Request" })
        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default contactController