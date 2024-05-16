'use client'

import ContentCard from '@/components/ContentCard'
import { useEffect, useState } from 'react';

const Page = () => {
const [profileData,setProfileData]= useState()

useEffect(() => {
  (async()=>{
    try {
     const res = await fetch("https://005e-197-251-205-121.ngrok-free.app/api/users/",{
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
      },
     })
     console.log(res);
     
    } catch (error) {
      
    }
  })()

  
}, [])

  return (
    <div>
      <ContentCard />
    </div>
  );
};

export default Page;
