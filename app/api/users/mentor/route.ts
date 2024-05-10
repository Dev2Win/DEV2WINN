import { connectToDB } from "@/lib/db"
import Mentor from "@/models/Mentor"
import User  from "@/models/User"
import { auth} from "@clerk/nextjs/server"


import { NextRequest, NextResponse } from "next/server"

export const POST =async(req:NextRequest)=>{
   try {
       const requestData = await req.json()
       const { sessionClaims } = auth()
   const sessionId = sessionClaims?.userId as string


       await connectToDB()
       const user= await User.findById(sessionId)   
   
    if(!user){
        return NextResponse.json({message:'user was not found'})
    }
    
    const newMentor = new Mentor({
        userId:user._id ,
        ...requestData
    })
    await newMentor.save()

    return NextResponse.json({message:'mentor created successfully',user:newMentor})
    
   } catch (error) {
    return NextResponse.json({ message: 'Failed to create mentor' });
   }
   
}

