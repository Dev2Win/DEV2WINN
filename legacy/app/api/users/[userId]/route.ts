import { connectToDB } from "@/lib/db"
import User from "@/models/User"
import { NextResponse } from "next/server"

export const PUT = async(req:Request,{params}:any)=>{
    try {
       const {userId} = params
       const response = await req.json()
   
       await connectToDB()
       const userUpdate = await User.findByIdAndUpdate({ userId },response,{ new: true })
       // update the clerk user too 
   
       if(!userUpdate){
       return NextResponse.json({ message: "User update  unsuccesful" })
       }
   
       return NextResponse.json({ message: "SUCCESS", user: userUpdate })
    }
   
    catch (error) {
       return NextResponse.json({message:'failed to fetch mentor'})
    }
   
   }