import { ApiError } from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Hostel } from "../models/hostel.model.js"

const MAX_DISTANCE_METERS= 100000
const searchHostels= asyncHandler(async (req,res)=>{
    const {longitude,latitude}= req.body
    if(!latitude || !longitude) throw new ApiError(400,"Both latitude and longitude are required")

    const nearbyHostels= await Hostel.aggregate([
        {
            $geoNear:{
                near:{
                    type: "Point",
                    coordinates:[longitude,latitude]
                },
                distanceField: "distance", // added field
                maxDistance: MAX_DISTANCE_METERS,
                spherical: true,
                distanceMultiplier: 1/1000 // meter to km
            }
        },
        {
            $project:{
                _id:1,
                name:1,
                desc:1,
                phone:1,
                email:1,
                gender:1,
                roomType:1,
                price:1,
                noOfRooms:1,
                facilities:1,
                address:1,
                city:1,
                state:1,
                pinCode:1,
                image:1,
                rating:1,
                location:1,
                reviewsCount:1,
                distance: { $round: ["$distance",2]}
            }
        }
    ]) 
    console.log("Nearby hostels found: ",nearbyHostels)
    return res
    .status(200)
    .json(new ApiResponse(200,nearbyHostels,"nearby hostels searched successfully"))

})

export {searchHostels}