import { connectToDB } from "@/lib/db"
import Course from "@/models/Course"
import { NextResponse } from "next/server"

type ParamsProps = {
    params: {
        title: string
    }
}

export const GET = async (request: Request, { params }: ParamsProps) => {
    const { title } = params

    try {
        await connectToDB()
        const course = await Course.findOne({ title })
        if (!course) {
            return NextResponse.json({ message: "Course not found" })
        }
        return NextResponse.json({ message: "SUCCESS", course })
    } catch (error) {
       throw error
    }
}