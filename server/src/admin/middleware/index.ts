import path from "path"
import { promises as fs } from "fs"
import { Request, Response, NextFunction } from "express"
import ejs from "ejs"
import multer from "multer"
import rateLimit from "express-rate-limit"
import * as include from "../include"
import { fsAccess, getUploadDir } from "../include"

export const setView = (req: Request, res: Response, next: NextFunction): void => {
    req.app.set("view engine", "ejs")
    req.app.set("views", path.join(process.cwd(), "client/admin/views"))
    req.app.engine("ejs", async (file, data, cb) => {
        try {
            const html = await ejs.renderFile(file, data, { async: true })
            cb(null, html)
        } catch (e) {
            cb(e, "")
        }
    })
    return next()
}

export const setInclude = (req: Request, res: Response, next: NextFunction): void => {
    const functions = include as Record<string, (...args: any[]) => any>
    for (const func in functions) res.locals[func] = functions[func]
    return next()
}

export const checkAuth = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
    const loggedIn = req.session.loggedIn || false

    if (!loggedIn) return res.status(403).json({ message: "Forbidden" })

    return next()
}

const entityMulter = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                const uploadPath = getUploadDir()

                if (await fsAccess(uploadPath)) {
                    await fs.rm(uploadPath, { recursive: true })
                    await fs.mkdir(uploadPath, { recursive: true })
                } else
                    await fs.mkdir(uploadPath, { recursive: true })

                return cb(null, uploadPath)
            } catch (e: any) {
                return cb(e, "")
            }
        },
        filename: (req, file, cb) => {
            const filename = `${Date.now()}${path.extname(file.originalname)}`

            cb(null, filename)
        }
    }),
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png|webp/
        const extname = fileTypes.test(path.extname(file.originalname).slice(1).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)

        if (mimetype && extname) return cb(null, true)
        else cb(new Error('File type is not accepted'))
    },
    limits: { fileSize: 1024 * 1024 }
})

export const entityUpload = (req: Request, res: Response, next: NextFunction): void => {
    entityMulter.single("entity_image")(req, res, (e) => {
        if (e) return res.status(400).json({ message: e.message })
        else return next()
    })
}

export const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    limit: 3,
    statusCode: 429,
    message: "Too many reguests",
    handler: (req, res, next, options) => res.status(options.statusCode).json({ message: options.message }),
})