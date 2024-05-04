import mongoose from "mongoose";


 const MenteeSchema = new mongoose.Schema({
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, unique: true },
  career_path:{type: String},
  desired_skills: [{ type :String}],
  experience_level:{type:String }, // novice , experienced , professional
  industry_pref: [{type:String }], // health , agriculture , mines , law , based on career choice
  availability: [{ type :String}], // weekdays and weekends and everyday 
  education_status:{type:String },// degree , high school diploma , masters , phd
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
  date: { type: Date, default: Date.now },
});

export const  Mentee = mongoose.model("Mentee", MenteeSchema);

