import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL!;
const MONGODB_URL ="mongodb+srv://simonadjei70:simonn70@cluster0.njfwwx3.mongodb.net/?retryWrites=true&w=majority"

// interface MongooseConn {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("MONGODB_URL is missing")

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "testing-mentee",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};