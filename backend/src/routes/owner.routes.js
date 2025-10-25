import Router from "express"
import { loginHostelOwner, logOutHostelOwner, registerHostelOwner } from "../controllers/hostelOwner.controller.js"

const router= Router()

router.route("/register").post(registerHostelOwner)
router.route("/login").post(loginHostelOwner)
router.route('/logout').post(logOutHostelOwner)

export default router