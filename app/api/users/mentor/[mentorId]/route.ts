
import { NextResponse } from "next/server";


export const GET = async(req:Request,{params}:any)=>{
 try {
    console.log(params,req);
 }

 catch (error) {
    return NextResponse.json({message:'failed to create mentor'})
 }

}