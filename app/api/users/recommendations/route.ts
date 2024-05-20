/* eslint-disable camelcase */
import { connectToDB } from "@/lib/db";
import Mentee from "@/models/Mentee";
import Mentor from "@/models/Mentor";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

 // check if user is a mentee or mentor
    // if a mentee extract the career choice and if possible other fields 
    // based on the career of the mentee check for mentors within those career fields
    // recommend those mentors

    // for mentors too check if the user is a mentor and based on the mentor career preferences 
    // check for mentors with any of the career preferences and recommend to the mentors

   

export const GET = async () => {
  try {
    await connectToDB();

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    let userRec, recommendedMentors;

    // Check if user is a mentee
    const menteeInfo = await Mentee.findOne({ userId: user._id });
    if (menteeInfo) {
      // Extract career preferences
      const { career_path } = menteeInfo;
      recommendedMentors = await Mentor.find({ career_preferences : career_path });

    if(!recommendedMentors)
    {
      userRec = { message: "NO MENTORS MATCH FOUND"};

    }
    userRec = { message: "MENTORS MATCH FOUND", recommendations:  recommendedMentors };

    } else {
      // Check if user is a mentor
      const mentorInfo = await Mentor.findOne({ userId: user._id });
      console.log(mentorInfo);
      
      if (mentorInfo) {

        const { career_preferences } = mentorInfo;

        recommendedMentors = await Mentee.find({ career_path:  career_preferences});
        console.log(recommendedMentors);
        
      if(!recommendedMentors || recommendedMentors.length === 0)
      {
        userRec = { message: "NO MENTEES MATCH FOUND" }
      } else{
        userRec = { message: "MENTEES MATCH FOUND", recommendations:  recommendedMentors }

      }
      
      } else {
       userRec = { message: "Neither MENTOR nor MENTEE MATCH found" };
      }
    }

    return NextResponse.json(userRec);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
};
