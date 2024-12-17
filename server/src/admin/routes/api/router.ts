import { Router } from "express"
import { checkAuth, entityUpload, authLimiter } from "../../middleware"
import authController from "../../controllers/api/authController"
import pageController from "../../controllers/api/pageController"
import settingController from "../../controllers/api/settingController"
import entityTypeController from "../../controllers/api/entityTypeController"
import attributeController from "../../controllers/api/attributeController"
import entityController from "../../controllers/api/entityController"
import taxonomyController from "../../controllers/api/taxonomyController"
import taxonomyTermController from "../../controllers/api/taxonomyTermController"
import sitemapController from "../../controllers/api/sitemapController"

const apiRouter = Router()

apiRouter.post("/auth", authLimiter, authController.api)
apiRouter.post("/page", checkAuth, pageController.api)
apiRouter.post("/setting", checkAuth, settingController.api)
apiRouter.post("/entity-type", checkAuth, entityTypeController.api)
apiRouter.post("/attribute", checkAuth, attributeController.api)
apiRouter.post("/entity", checkAuth, entityUpload, entityController.api)
apiRouter.post("/taxonomy", checkAuth, taxonomyController.api)
apiRouter.post("/taxonomy-term", checkAuth, taxonomyTermController.api)
apiRouter.post("/sitemap", checkAuth, sitemapController.api)

export default apiRouter