import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app= express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import hostelRouter from "./routes/hostel.routes.js"
app.use("/api/v1/hostel",hostelRouter)
import ownerRouter from "./routes/owner.routes.js"
app.use("/api/v1/owner",ownerRouter)

export {app}