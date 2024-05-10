
import { connectToDB } from "@/lib/db";
import Mentor from "@/models/Mentor";
import { NextResponse } from "next/server";

type ParamsProps = {
    params: {
        mentorId: string;
    }
}

export const GET = async({params}:ParamsProps)=>{
 try {
    const {mentorId} = params

    await connectToDB()
    const mentorInfo = await Mentor.findById({ mentorId })

    if(!mentorInfo){
    return NextResponse.json({ message: "Mentor not found" })
    }

    return NextResponse.json({ message: "SUCCESS", user: mentorInfo })
 }

 catch (error) {
    return NextResponse.json({message:'failed to fetch mentor'})
 }

}

export const PUT = async(req:Request,{params}:any)=>{
    try {
       const {mentorId} = params
       const response = await req.json()
   
       await connectToDB()
       const mentorInfo = await Mentor.findByIdAndUpdate({ mentorId },response,{ new: true })
   
       if(!mentorInfo){
       return NextResponse.json({ message: "Mentor  not updated" })
       }
   
       return NextResponse.json({ message: "SUCCESS", user: mentorInfo })
    }
   
    catch (error) {
       return NextResponse.json({message:'failed to fetch mentor'})
    }
   
   }