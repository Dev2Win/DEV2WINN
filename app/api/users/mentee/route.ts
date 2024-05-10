import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import { connectToDB } from "@/lib/db";


export const POST = async (request: Request)=>{
   const user = await request.json()
   const { sessionClaims } = auth()
   const userId = sessionClaims?.userId as string


   await connectToDB()
   const loggedInUser = await User.findById(userId) 

   if (!loggedInUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
   }

   const menteeUser = {
      userId: loggedInUser._id,
      ...user
   }

   const createdMenteeUser = await Mentee.create(menteeUser)
   return NextResponse.json({ message: "SUCCESS", user: createdMenteeUser })
}

export const GET = async () => {
   await connectToDB()
   const allMenteeUsers = await Mentee.find()
   return NextResponse.json({ message: "SUCCESS", users: allMenteeUsers })
}