
import { connectToDB } from "./db";
import { User } from "@/models/User";

export async function createUser(user: any) {
    try {
      await connectToDB();
      const newUser =  new User(user)
      await newUser.save()
      return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
      console.log(error);
    }
  }

  // determine usertype
// let userType: 'mentee' | 'mentor' | null = null;

// export function setUserType(type: 'mentee' | 'mentor') {
//   userType = type;
// }

// export function getUserType() {
//   return userType;
// }