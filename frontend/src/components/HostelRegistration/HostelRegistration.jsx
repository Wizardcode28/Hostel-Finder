import React, { useEffect } from 'react'
import { useState } from 'react'
import "./HostelRegistration.css"
import { useNavigate } from 'react-router-dom'

const HostelRegistration = () => {
  const navigate= useNavigate()
  const accessToken = localStorage.getItem('accessToken') || ''; 
  useEffect(() => {
    if(!accessToken || accessToken==='') {
    navigate('/login')
  }
  }, [accessToken,navigate])
  


  const [formData, setformData] = useState({
    name: '',
    desc: '',
    phone: '',
    email: '',
    gender: '',
    roomType: '',
    price: 0,
    noOfRooms: '',
    facilities: [],
    address: '',
    city: '',
    state: '',
    pinCode: '',
    location: {
      type: "Point",
      coordinates:[0,0]
    },
    image: ''
  })

  const FACILITY_OPTIONS= ["Wifi","Laundry","Mess","AC","Non-AC","Power backup","Parking","Gym","Study Room","CCTV","24*7 Water","Attached Bathroom", "Hot Water", "Housekeeping", "Security Guard"]

    const handleChange= (e)=>{
      const {name,value,type,checked}= e.target
        if(name==='facilities' && type==='checkbox'){
          setformData(prevData=>{
            const prevFacilities= prevData.facilities
            if(checked){
              return {...prevData,facilities:[...prevFacilities,value]}
            }
            else{
              return {...prevData,facilities: prevFacilities.filter(f=>f!==value)}
            }
          })
        }
        else if(name==="price" || name==='noOfRooms'){
          const numValue= parseFloat(value) || 0
          setformData(prevData=>({...prevData,[name]:numValue}))
        }
        else{
          setformData(prevData=>({...prevData,[name]:value}))
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        let formCoords= formData.location.coordinates
        if(formCoords.length!==2 || formCoords[0]===0 || formCoords[1]===0){
          const {address,city,state,pinCode}= formData
          if(!address || !city || !state){
            alert("Please fill all required fields- address, city, state or Get Current Location")
            return
          }

          const response= await fetch(`${import.meta.env.VITE_API_BASE_URL}/hostel/encode`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify({address,city,state,pinCode})
          })
          if(!response.ok){
            alert("Error while using geoCoding service")
            return
          }
          const data= await response.json()
          const coordinates= data.data
          console.log(coordinates)
          if(!coordinates || coordinates.length!=2){ 
            alert("Problem while encoding address")
          }
          else{
            formCoords=coordinates
            setformData(prevData=>({
              ...prevData,
              location:{
                type: "Point",
                coordinates:formCoords
              }
            }))
          }
        } 
        const [lng,lat]= formCoords
        const payload={
          ...formData,
          location:{
            type: "Point",
            coordinates:[
              parseFloat(lng),
              parseFloat(lat)
            ]
          }
        }
        try{
          const response= await fetch(`${import.meta.env.VITE_API_BASE_URL}/hostel/register`,{
            method: "POST",
            credentials: "include",
            headers:{
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          })
          if(response.status===401){
            alert("Onwer not logged in. Redirecting to login.")
            navigate('/login')
          }
          const data= await response.json()
          console.log("Form submitted successfully")
          console.log("Server Response: ",data)
          alert("Form submitted successfully")
          navigate('/dashboard')
        }
        catch(err){
          console.log("Error while submitting form: ",err)
          alert("Failed to register hostel. Try again later")
          
        }
    }

    const handleGetLocation= ()=>{
      if(!navigator.geolocation){
        alert("navigation is not supported by your browser")
        return
      }
      alert("Requesting your current location. Please allow access")
      
      navigator.geolocation.getCurrentPosition(
        position=>{
        const lat= position.coords.latitude
        const lng= position.coords.longitude

        setformData(prevData=>({
          ...prevData,
           // no of digits after decimal
           // use parseFloat so that numbers are sent instead of string
          location:{
            ...prevData.location,
            coordinates: [parseFloat(lng.toFixed(6)),parseFloat(lat.toFixed(6))]
          }
        }))
        console.log(`Location set: Lat=${lat}, Lng=${lng}`);
      },  
        (error)=>{
          let message="Failed to get location."
          if(error.code===error.PERMISSION_DENIED) message="Location permission denied. Please allow access or enter manually."
          else if(error.code===error.POSITION_UNAVAILABLE) message="Location information is currently unavailable."
          alert(message)
          console.error("Geolocation error: ",error)
        },
        {
          // options for getCurrentPosition
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // don't use cached position
        }
      )}

    const handleKeyPress= (e)=>{
      if(e.key==='Enter'){
        e.preventDefault()
      }
    }
    
  return (
    <div className="hostel-registration-container">
      <h2>Hostel Application Form</h2>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required placeholder="Enter hostel name" onChange={handleChange} value={formData.name} />

        <label htmlFor="desc">Description (Max Length):1000</label>
        <input type="text" id="desc" name="desc" required value={formData.desc} onChange={handleChange} placeholder="something about hostel"/>

        <label htmlFor="phone">Mobile No.</label>
        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="1234567890"/>

        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@email.com"/>

        <label htmlFor="gender">Gender</label>
        <select name="gender" id="gender" value={formData.gender} required onChange={handleChange}> <option value="" disabled>Choose Gender</option> <option value="Male">Male</option> <option value="Female">Female</option> </select>

        {/* Room Type Select */}
        <label htmlFor="roomType">Room Type</label>
        <select id="roomType" name="roomType" value={formData.roomType} required onChange={handleChange}> <option value="" disabled>Select Room Type</option> <option value="single">Single Room</option> <option value="double">Double Sharing</option> <option value="dorm">Dormitory Bed</option></select>
        
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" value={formData.price} required onChange={handleChange}/>

        <label htmlFor="noOfRooms">No. of Available Rooms</label>
        <input type="number" id="noOfRooms" name="noOfRooms" required value={formData.noOfRooms} onChange={handleChange} placeholder="no of rooms available in hostel"/>

        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} placeholder="Your hostel address..."/>

        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="Bharatpur"/>

        <label htmlFor="state">State</label>
        <input type="text" id="state" name="state" required value={formData.state} onChange={handleChange} placeholder="Rajasthan"/>

        <label htmlFor="pinCode">Pin Code</label>
        <input type="text" id="pinCode" name='pinCode' value={formData.pinCode} onChange={handleChange} placeholder="321406"/>

         <p className="text-sm text-gray-700 text-center">
          If you cannot use live location, we will automatically determine coordinates from the address fields above when you submit.
         </p>
        <div className="location-group" style={{ display: 'flex', gap: '10px' }}>
        
        {/* Button to trigger geolocation */}
          <button 
              type="button" 
              onClick={handleGetLocation}
              style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
              }}
          >
              Get Current Location 📍
          </button>
        </div>

        {/* Display captured coordinates */}
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: formData.location ? '#42b72a' : '#888' }}>
            Latitude: {formData.location.coordinates[1] || 'N/A'} | 
            Longitude: {formData.location.coordinates[0] || 'N/A'}
        </div>

        {/* --- FACILITIES SECTION --- */}
        <div className="facilities-section">
            <h2 className="section-title">Facilities</h2>
            <div className="facilities-grid">
                {FACILITY_OPTIONS.map(facility => (
                    <label key={facility} className="facility-item">
                        <input
                            type="checkbox"
                            name="facilities"
                            value={facility}
                            checked={formData.facilities.includes(facility)}
                            onChange={handleChange}
                            className="facility-checkbox"
                        />
                        <span className="capitalize">{facility}</span>
                    </label>
                ))}
            </div>
        </div>
        <label htmlFor="image">Hostel Image URL (Optional)</label>
        <input type="text" id="image" name="image" placeholder='https://example.com/hostel.jpg' onChange={handleChange}/>     
        <button type="submit">Submit Application</button>
      </form>
    </div>
  )
}
export default HostelRegistration