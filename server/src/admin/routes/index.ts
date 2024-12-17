import { Router } from "express"
import apiRouter from "./api/router"
import router from "./router"
import { setView, setInclude } from "../middleware"

const adminRouter = Router()

adminRouter.use(setView)
adminRouter.use(setInclude)

adminRouter.use("/admin/api", apiRouter)
adminRouter.use("/admin", router)

export default adminRouter