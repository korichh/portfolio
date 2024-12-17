import { Router } from "express"
import mainController from "../controllers/mainController"

const router = Router()

router.get("/", mainController.pass, mainController.auth, mainController.entity, mainController.get)

export default router