import { Router } from "express"
import mainController from "../controllers/mainController"

const router = Router()

router.get("/*", mainController.get)

export default router