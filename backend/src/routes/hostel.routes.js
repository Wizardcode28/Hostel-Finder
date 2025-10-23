import Router from "express"
import { registerHostel } from "../controllers/hostel.controller.js"
import { searchHostels } from "../controllers/search.controller.js"
import { geocodeAddress } from "../controllers/geocode.controller.js"

const router= Router()
router.route('/').get((req,res)=>{
    res.send("hii")
})
router.route("/register").post(registerHostel)
router.route("/search").post(searchHostels)
router.route("/encode").post(geocodeAddress)

export default router