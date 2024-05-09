import { connectToDB } from "@/lib/db"
import Mentor from "@/models/Mentor"
import User  from "@/models/User"
import { currentUser } from "@clerk/nextjs/server"


import { NextRequest, NextResponse } from "next/server"

export const POST =async(req:NextRequest)=>{
   try {
       const requestData = await req.json()
       const loggedInClerkUser = await currentUser()

       await connectToDB()
       const user= await User.findById({clerkId:loggedInClerkUser?.id})   
   
    if(!user){
        return NextResponse.json({message:'user was not found'})
    }
    
    const newMentor = new Mentor({
        userId:user._id ,
        ...requestData
    })
    await newMentor.save()

    return NextResponse.json({message:'mentor created successfully',mentor:newMentor})
    
   } catch (error) {
    return NextResponse.json({ message: 'Failed to create mentor' });
   }

    


   
}

