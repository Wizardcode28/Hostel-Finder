import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Hostel } from "../models/hostel.model.js";

const registerHostel= asyncHandler(async (req,res)=>{
    const {name,desc,phone,email,gender,roomType,price,noOfRooms,facilities,address,city,state,pinCode,location,image}= req.body
    const owner= req.user?._id
    if(!owner) throw new ApiError(401,"First register hostel owner or log in again")

    if([name,desc,phone,email,gender,roomType].some(e=>{
        return e?.trim()===""
    })){
        throw new ApiError(400,"All fields are required")
    }

    const existedHostel= await Hostel.findOne({
        $or:[
            //Use case-insensitive regex for the name check
            { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
            // the and THE are same thus error
            // {name},
            {email: email.toLowerCase().trim()}
        ]
    })

    if(existedHostel) throw new ApiError(409,"Hostel with same name or email already exists")
    
    const hostel= await Hostel.create({
        owner,name,desc,phone,email,gender,roomType,price,noOfRooms,facilities,address,city,state,pinCode,location,image
    })

    if(!hostel) throw new ApiError(500,"something went wrong while registering the hostel")
    
    return res
    .status(200)
    .json(new ApiResponse(200,hostel,"Hostel registered successfully"))
})

const getHostel= asyncHandler (async (req,res)=>{
    const ownerId= req.user?._id
    const hostel= await Hostel.findOne({owner: ownerId})
    const ownerName= req.user?.name
    if(!hostel) throw new ApiError(404,"Owner has not registered hostel yet")
    const hostelObject= hostel.toObject()

    return res
    .status(200)
    .json(new ApiResponse(200,{...hostelObject,ownerName},"Hostel found successfully"))
})

export {registerHostel,getHostel}