import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import { connectToDB } from "@/lib/db";


export const POST = async (request: Request)=>{
   const user = await request.json()
   const clerkUser = await currentUser()

   await connectToDB()
   const loggedInUser = await User.findById({ clerkId : clerkUser?.id }) 

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