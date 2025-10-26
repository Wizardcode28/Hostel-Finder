import Router from "express"
import { getHostel, registerHostel } from "../controllers/hostel.controller.js"
import { searchHostels } from "../controllers/search.controller.js"
import { geocodeAddress } from "../controllers/geocode.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router= Router()
router.route('/').get((req,res)=>{
    res.send("hii")
})
router.route("/register").post(verifyJWT,registerHostel)
router.route("/search").post(searchHostels)
router.route("/encode").post(verifyJWT,geocodeAddress)
router.route('/my-hostel').get(verifyJWT,getHostel)

export default router