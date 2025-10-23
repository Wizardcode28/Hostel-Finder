import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Hostel } from "../models/hostel.model.js";

const registerHostel= asyncHandler(async (req,res)=>{
    const {name,desc,phone,email,gender,roomType,price,noOfRooms,facilities,address,city,state,pinCode,location,image}= req.body
    if([name,desc,phone,email,gender,roomType].some(e=>{
        e?.trim()===""
    })){
        throw new ApiError(400,"All fields are required")
    }
    console.log(req.body)

    const existedHostel= await Hostel.findOne({
        $and:[{name},{email}]
    })

    if(existedHostel) throw new ApiError(400,"Hostel with name or email already exists")
    
    const hostel= await Hostel.create({
        name,desc,phone,email,gender,roomType,price,noOfRooms,facilities,address,city,state,pinCode,location,image
    })

    if(!hostel) throw new ApiError(500,"something went wrong while registering the hostel")
    
    return res
    .status(200)
    .json(new ApiResponse(200,hostel,"Hostel registered successfully"))
})

export {registerHostel}