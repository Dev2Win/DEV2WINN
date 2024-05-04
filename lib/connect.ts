import { Mentee } from "@/models/Mentee";
import { connectToDB } from "./db";

export async function createUser(user: any) {
    try {
      await connectToDB();
      const newUser =  new Mentee(user)
      await newUser.save()
      return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
      console.log(error);
    }
  }