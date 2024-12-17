import { Router } from "express"
import { contactLimiter } from "../../middleware"
import entityController from "../../controllers/api/entityController"
import contactController from "../../controllers/api/contactController"

const apiRouter = Router()

apiRouter.post("/entity", entityController.api)
apiRouter.post("/contact", contactLimiter, contactController.api)

export default apiRouter