import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const hostelOwnerSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 50,
        },
        email:{
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            maxlength: 50,
            trim: true
        },
        password:{
            type: String,
            required: true
        },
        refreshToken:{
            type: String
        }
    },
    {timestamps: true}
)

// methods
hostelOwnerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})

hostelOwnerSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

hostelOwnerSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
hostelOwnerSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const HostelOwner= mongoose.model("HostelOwner",hostelOwnerSchema)