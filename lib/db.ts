import mongoose from "mongoose";

let isConnected = false;
 const URL = process.env.MONGODB_URL 

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    if (URL && typeof URL === 'string') {
        await mongoose.connect(URL
         
        );
      } else {
        console.error('MongoDB URL environment variable is not set or is not a string.');
      }

    isConnected = true;

    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.log(error);
  }
};
