import { NextResponse } from "next/server"
import Mentee from "@/models/Mentee"
import { connectToDB } from "@/lib/db";

type ParamsProps = {
    params: {
        menteeId: string;
    }
}

// fetching a specific mentee information
export const GET = async (request: Request, { params }: ParamsProps) => {
    const { menteeId } = params 

    await connectToDB()
    const menteeInfo = await Mentee.findById({ menteeId })
    return NextResponse.json({ message: "SUCCESS", user: menteeInfo })
}

// using PATCH coz not all fields will be updated by the user
export const PATCH =  async (request: Request,{ params }: ParamsProps) => {
    const { menteeId } = params
    const res = await request.json()
    
    // query the mentee id and update it
    await connectToDB()
    const updatedMentee = await Mentee.findByIdAndUpdate({ menteeId }, res, { new: true })

    return NextResponse.json({message:'success', user: updatedMentee })
}