import Mentor from "@/models/Mentor";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export const GET = async(req:NextApiRequest,{params}:any)=>{
 try {
    console.log(params,req);
 }

 catch (error) {
    return NextResponse.json({message:'failed to create mentor'})
 }

}