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

  // determine usertype
let userType: 'mentee' | 'mentor' | null = null;

export function setUserType(type: 'mentee' | 'mentor') {
  userType = type;
}

export function getUserType() {
  return userType;
}