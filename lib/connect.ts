import { connectToDB } from './db';
import User from '@/models/User';

export async function createUser(user: any) {
  try {
    await connectToDB();
    // had to change the User type here for testing
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

// export async function deleteUser(user: any) {
//   try {
//     await connectToDB();
//     // had to change the User type here for testing
//     const newUser =  await User.create(user)
//     return JSON.parse(JSON.stringify(newUser));
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function updateUser(user: any) {
//   try {
//     await connectToDB();
//     // had to change the User type here for testing
//     const updatedUser =  await User.findByIdAndUpdate({ user?.clerkId },user,{ new: true })
//     return JSON.parse(JSON.stringify(updatedUser));
//   } catch (error) {
//     console.log(error);
//   }
// }
