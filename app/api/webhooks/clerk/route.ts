

import { createUser} from "@/lib/connect";
import { WebhookEvent,clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";


export async function POST(req: Request) {

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  /* eslint-disable camelcase */
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE User in mongodb

  if (eventType === "user.created") {
    
    const { id, email_addresses, first_name, last_name } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
     
    };


   // Wait for the user type endpoint to be triggered
let userType = null;
const maxRetries = 1000; // Maximum number of retries
const retryDelay = 1000; // Delay between retries (in milliseconds)

for (let i = 0; i < maxRetries; i++) {
  // userType = getUserType();
  // if (userType !== null) {
  //   break;
  // }
  await new Promise((resolve) => setTimeout(resolve, retryDelay));
}

  if (userType === null) {
    console.error('User type not received after maximum retries');
    return new Response('Error: User type not received', { status: 500 });
  }

  let newUser;

    if (userType === 'mentee') {
      // Call a fn to to create a mentee user
      newUser = await createUser(user);
    } else if (userType === 'mentor') {
      // Call a fn to create a mentor user
      // newUser = await createUser(user);
    } else {
      // Handle other cases or return an error
      return new Response("Invalid user type", { status: 400 });
    }

 
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "New user created", user: newUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}