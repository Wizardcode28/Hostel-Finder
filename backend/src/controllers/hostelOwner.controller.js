import { Hostel } from "../models/hostel.model.js";
import { HostelOwner } from "../models/hostelOwner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens= async (ownerId)=>{
    try {
        const owner= await HostelOwner.findById(ownerId)
        const accessToken= owner.generateAccessToken()
        const refreshToken= owner.generateRefreshToken()
        owner.refreshToken= refreshToken
        await owner.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(400,"Something went wrong while generating access and refresh token")
    }
}

const options={// cookie
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
}

const registerHostelOwner= asyncHandler(async (req,res)=>{
    const {name,email,password}= req.body
  
    if(!name || !email || !password) throw new ApiError(400,"All fields are required")

    if([name,email,password].some(e=>{
        return e?.trim()===""
    })) throw new ApiError(400,"All fields should be filled properly")
    
    const existedOwner= await HostelOwner.findOne({
        $or: [{email}]
    })

    if(existedOwner) throw new ApiError(409,"Hostel Owner with same name or email already exists")

    const owner= await HostelOwner.create({
        name,email,password
    })

    const createdOwner= await HostelOwner.findById(owner?._id).select("-password -refreshToken")
    if(!createdOwner) throw new ApiError(500,"Something went wrong while registering hostel owner")
    
    return res
    .status(201)
    .json(new ApiResponse(201,createdOwner,"Hostel Owner registered successfully"))
})

const loginHostelOwner= asyncHandler(async (req,res)=>{
    const {email,password}= req.body
    if(!email || !password) throw new ApiError(400,"Both email and password fields are required")
    if([email,password].some(e=>{
        return e?.trim()===''
    })) throw new ApiError(400,"Both email and password should be filled properly")

    const exists= await HostelOwner.findOne({
        $and: [{email}]
    })

    if(!exists) throw new ApiError(404,"Hostel Owner does not exist")
    
    const isPasswordValid= await exists.isPasswordCorrect(password) 

    if(!isPasswordValid) throw new ApiError(401,"Invalid Credentials Provided")

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(exists._id)
    let owner= await HostelOwner.findById(exists._id).select("-password -refreshToken")
    owner= owner.toObject()
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        hostelOwner: owner, accessToken,refreshToken
    },
    "hostel owner logged in successfully"
    ))
})


const logOutHostelOwner= asyncHandler (async (req,res)=>{
    await HostelOwner.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"Hostel owner logged out"))
})

export {registerHostelOwner,loginHostelOwner,logOutHostelOwner}
