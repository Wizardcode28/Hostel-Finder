import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB= async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB Connected! DB Host: "${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection error: ",error)
        process.exit(1) // ends Node.js process immediately it is global object
        // gives information and control over current running process
    }
} 

export default connectDB