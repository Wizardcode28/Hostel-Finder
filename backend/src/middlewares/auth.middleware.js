import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { HostelOwner } from "../models/hostelOwner.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT= asyncHandler(async (req,_,next)=>{
    try {
        console.log(req.cookies)
        // const accessToken= req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]
        const token= req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ",'')
        console.log(token)
        if(!token) throw new ApiError(401,"Unathorized access")
        
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const owner= await HostelOwner.findById(decodedToken?._id).select("-password -refreshToken")
        if(!owner) throw new ApiError(401,"Invalid access token")
        req.user= owner
    
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || 'Invalid or expired access token')
    }
})