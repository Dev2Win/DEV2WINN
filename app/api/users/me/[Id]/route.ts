/* eslint-disable camelcase */
import { connectToDB } from '@/lib/db';
import Mentee from '@/models/Mentee';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const GET = async (req:any, { params }:any) => {
  try {
    await connectToDB();
    const res = auth();
    const re = currentUser();
    console.log('ioioio', res);
    console.log('jdjdd', re);

    const { Id } = params; // Extract userId from params

    console.log('User ID from params:', Id);

    const user = await User.findById(Id);
    console.log(user);

    if (!user) {
      return NextResponse.json({ message: 'User not found' });
    }

    let userInfo;

    const menteeInfo = await Mentee.findOne({ userId: user._id });
    if (menteeInfo) {
      userInfo = {
        message: 'MENTEE fetched',
        user: { ...user.toObject(), menteeInfo },
      };
    } else {
      const mentorInfo = await Mentor.findOne({ userId: user._id });
      if (mentorInfo) {
        userInfo = {
          message: 'MENTOR fetched',
          user: { ...user.toObject(), mentorInfo },
        };
      } else {
        userInfo = { message: 'Neither MENTOR nor MENTEE found' };
      }
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
};
