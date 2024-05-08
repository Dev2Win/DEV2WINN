import mongoose from "mongoose";


 const UserSchema = new mongoose.Schema({
  firstName: { type: String},
  lastName: { type: String},
  userName: { type: String},
  email: { type: String, required: true, unique: true },
  
  date: { type: Date, default: Date.now },
});

export const  User = mongoose.model("User", UserSchema);

