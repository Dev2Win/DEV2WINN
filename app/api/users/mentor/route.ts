import { connectToDB } from "@/lib/db"
import Mentor from "@/models/Mentor"
import { User } from "@/models/User"


import { NextRequest, NextResponse } from "next/server"

export const POST =async(req:NextRequest)=>{
   try {
    await connectToDB()
    const requestData = await req.json()
    const {email}= requestData
   const user = await User.findOne({email})
    if(!user){
        return NextResponse.json({message:'user was not found'})
    }
    const newMentor = new Mentor({
        user:user._id

    })

    await newMentor.save()

    return NextResponse.json({message:'mentor created successfully',newMentor})
    


  
   } catch (error) {
    return NextResponse.json({ message: 'Failed to create mentor' });
   }

    


   
}

