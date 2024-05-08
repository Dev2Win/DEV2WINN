import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import { connectToDB } from "@/lib/db";


export const POST = async (req:Request)=>{
   // extra information from request body
   // this information will come from the request body
   // hardcoded it for now
   const user = {
      career_path: "Software Engineering",
   }

   // copied the userid from mongo to test
   const userId = "663b868e52f47d352c9b8420"
   
   if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
   }

   const menteeUser = {
      userId: userId,
      ...user
   }
   console.log(menteeUser)

   await connectToDB()
   const createdMenteeUser = await Mentee.create(menteeUser)

   return NextResponse.json({ message: "SUCCESS", user: createdMenteeUser })
}