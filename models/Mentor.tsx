import mongoose, { Schema } from "mongoose";


const MentorSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
    career_preferences: [{type: String , required : true}],
    com_products_building: [{type: String , }],// products the openverse community is working and mentors associated with any
    date: { type: Date, default: Date.now },
    chats: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
        default: [],
      }
});

const Mentor = mongoose.model("Mentor", MentorSchema);

export default Mentor
