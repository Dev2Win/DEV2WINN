import React, { useEffect } from 'react'

const RECOMMENDATIONS = process.env.RECOMMENDATIONS || "https://dev-2-winn.vercel.app/api/users/recommendations/"
const Mentors = () => {
    
  useEffect(() => {
    (async()=>{
      try {
        await fetch(RECOMMENDATIONS,{
        method:"GET",
        headers: {
          'Content-Type': 'application/json',
        },
       })
      //  const profileInfo:any = await res.json()       
      } catch (error) {
        console.log(error)
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
