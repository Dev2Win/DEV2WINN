import { connectToDB } from '@/lib/db';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await req.json();
    const { sessionClaims } = auth();
    const sessionId = sessionClaims?.userId as string;

    await connectToDB();
    const user = await User.findById(sessionId);
    console.log(user);

    if (!user) {
      return NextResponse.json({ message: 'user was not found' });
    }

    const newMentor = {
      userId: user._id,
      ...requestData,
    };
    const createdMentorUser = await Mentor.create(newMentor);

    return NextResponse.json({
      message: 'mentor created successfully',
      user: createdMentorUser,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create mentor' });
  }
};


export const GET = async () => {
  try {
    await connectToDB();

    // const { sessionClaims } = auth();
    // const userId = sessionClaims?.userId as string;

    const mentors = await Mentor.find().populate('userId');
    
    if (!mentors || mentors.length === 0) {
      return NextResponse.json({ message: "User not found" });
    }

     
  // eslint-disable-next-line camelcase


  

    return NextResponse.json(mentors);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
};

