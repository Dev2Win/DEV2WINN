import { NextRequest, NextResponse } from 'next/server';



export const POST = async (req: NextRequest) => {
  try {
    const res = await req.json();
    const {userType}=  res

    if (!userType ) {
      return NextResponse.json(
        { message: 'Invalid userType provided' },
        { status: 400 }
      );
    }

    

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