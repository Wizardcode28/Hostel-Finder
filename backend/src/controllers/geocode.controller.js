import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";  
  
const geocodeAddress = asyncHandler(async (req,res)=>{
    const {address,city,state,pinCode}= req.body
    const fullAddress=`${address}, ${city}, ${state},${pinCode || ''}`
    // encoding query since url can only contains special keywords like /,?,=,_,-
    const query= encodeURIComponent(fullAddress)
    // otherwise spaces and commas can give error or wrong results
    // it replaces special keywords with their url-safe encodings, space- %

    // nominatim api endpoint
    const apiUrl= `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`

    const response = await fetch(apiUrl,{
        headers:{
            'User-Agent': 'HostelRegistrationApp/1.0 (mittalsarthak2007@gmail.com)'
        }
    })
    if(!response.ok) throw new ApiError(400,"Geocoding service failed")
    console.log(response)
    const data= await response.json()
    console.log(data)
    if(!data || data.length===0) throw new ApiError(400,"Error in encoding address")
    // api gives coordinates as strings we pass them as floats
    const lng= parseFloat(data[0].lon)
    const lat= parseFloat(data[0].lat)
    res
    .status(200)
    .json(new ApiResponse(200,[lng,lat],"address encoding successfully"))
})

export {geocodeAddress}