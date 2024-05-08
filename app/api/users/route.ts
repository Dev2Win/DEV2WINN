import { NextRequest, NextResponse } from 'next/server';
import { setUserType } from '@/lib/connect';



export const POST = async (req: NextRequest) => {
  try {
    const res = await req.json();
    const {userType}=  res

    if (!userType || !['mentor', 'mentee'].includes(userType)) {
      return NextResponse.json(
        { message: 'Invalid userType provided' },
        { status: 400 }
      );
    }

    await setUserType(userType);

    return NextResponse.json(
      { message: 'userType received', userType },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting userType:', error);
    return NextResponse.json(
      { message: 'Error setting userType' },
      { status: 500 }
    );
  }
};