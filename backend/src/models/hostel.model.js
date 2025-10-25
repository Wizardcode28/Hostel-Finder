import mongoose from "mongoose"

const hostelSchema= new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "HostelOwner",
            required: true
        },  
  
        name:{
            type: String,
            required:true,
            unique: true,
            trim: true
        },

        desc:{
            type: String,
            required:true,
            trim: true,
            maxlength: 1000
        },

        phone:{
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },

        email:{
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            match: [/.+@.+\..+/, 'Please fill a valid email address'] ,
            maxlength: 50
        },

        gender:{
            type: String,
            enum: ["Male","Female"],
            required: true,
            default: "Male"
        },

        roomType:{
            type: String,
            enum:["single","double","dorm"],
            default: "single",
            required: true
        },

        price:{
            type: Number,
            required: true,
            default: 0,
            min:0
        },

        noOfRooms:{
            type: Number,
            required: true,
            default:0,
            min:0
        },

        facilities:{
            type: [String],
            default: [],
            enum:["Wifi","Laundry","Mess","AC","Non-AC","Power backup","Parking","Gym","Study Room","CCTV","24*7 Water","Attached Bathroom", "Hot Water", "Housekeeping", "Security Guard"]
        },

        address:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 200
        },

        city:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 30
        },

        state:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 100
        },

        pinCode:{
            type: String,
            trim: true,
            maxlength: 6
        },
        
        location:{
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates:{
                type: [Number],
                required: true
            }
        },
        image:{
            type: String
        },

        rating:{
            type: Number,
            min:0,
            max:5
        },
        reviewsCount:{
            type: Number,
            default: 0
        }

    },
    {timestamps:true}
)

hostelSchema.index({city:1})
hostelSchema.index({price:1})
hostelSchema.index({gender:1})
hostelSchema.index({facilities:1})
hostelSchema.index({location: "2dsphere"})
export const Hostel= mongoose.model("Hostel",hostelSchema)
