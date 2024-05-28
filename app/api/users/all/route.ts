/* eslint-disable camelcase */
import { connectToDB } from "@/lib/db"

import User from "@/models/User"
// import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    await connectToDB();

    // const { sessionClaims } = auth();
    // const userId = sessionClaims?.userId as string;

    const users = await User.find();
    
    if (!users || users.length === 0) {
      return NextResponse.json({ message: "User not found" });
    }

     
  // eslint-disable-next-line camelcase


  

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
};

