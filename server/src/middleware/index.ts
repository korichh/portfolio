import "dotenv/config"
import path from "path"
import { Request, Response, NextFunction } from "express"
import session from "express-session"
import connectSessionSequelize from "connect-session-sequelize"
import ejs from "ejs"
import rateLimit from "express-rate-limit"
import sequelize from "../config/connection"
import * as include from "../include"

const SequelizeStore = connectSessionSequelize(session.Store)
const IN_PROD = process.env.NODE_ENV === "prod"
const SESSION_OPTIONS = {
    SESSION_NAME: process.env.SESSION_NAME || "SID",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
}

export const setSession = session({
    name: SESSION_OPTIONS.SESSION_NAME,
    secret: SESSION_OPTIONS.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({ db: sequelize }),
    cookie: {
        secure: IN_PROD,
        sameSite: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2
    },
})

export const setView = (req: Request, res: Response, next: NextFunction): void => {
    req.app.set("view engine", "ejs")
    req.app.set("views", path.join(process.cwd(), "client/views"))
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

export const contactLimiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    limit: 2,
    statusCode: 429,
    message: "Too many reguests",
    handler: (req, res, next, options) => res.status(options.statusCode).json({ message: options.message }),
})