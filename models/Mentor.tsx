const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
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
