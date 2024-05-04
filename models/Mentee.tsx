const mongoose = require("mongoose");

 const MenteeSchema = new mongoose.Schema({
  first_name: { type: String, required: true},
  last_name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  career_path:{type: String, required:true},
  desired_skills: [{ type :String}],
  experience_level:{type:String , required: true}, // novice , experienced , professional
  industry_pref: [{type:String , required: true}], // health , agriculture , mines , law , based on career choice
  availability: [{ type :String}], // weekdays and weekends and everyday 
  education_status:{type:String , required: true },// degree , high school diploma , masters , phd
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
  date: { type: Date, default: Date.now },
});

export const  Mentee = mongoose.model("Mentee", MenteeSchema);

