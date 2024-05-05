import { setUserType } from "@/lib/connect"
import { NextResponse } from "next/server"
// req to get usertype : Mentee or mentor

export const POST = async(req:any)=>{
    const { userType } = await req.json();
    setUserType(userType);

    return NextResponse.json({message:'success'})
}


