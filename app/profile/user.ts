import { currentUser } from "@clerk/nextjs/server";
  

export const loggedInUser = currentUser();