import { Router } from "express"
import apiRouter from "./api/router"
import router from "./router"
import { setView, setInclude } from "../middleware"

const mainRouter = Router()

mainRouter.use(setView)
mainRouter.use(setInclude)

mainRouter.use("/api", apiRouter)
mainRouter.use("/", router)

export default mainRouter