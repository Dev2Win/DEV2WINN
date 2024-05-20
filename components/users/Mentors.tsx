import React, { useEffect } from 'react'

const Mentors = () => {
    
useEffect(() => {
    (async()=>{
      try {
       const res = await fetch("http://localhost:3000/api/users/recommendations/",{
        method:"GET",
        headers: {
          'Content-Type': 'application/json',
        },
       })
       const profileInfo:any = await res.json()
    //    setProfileData(profileInfo?.user)
       console.log(profileInfo);
       
       
      } catch (error) {
        
      }
    })()
  
    
  }, [])
  return (
    <div>
      Mentors here
    </div>
  )
}

export default Mentors
