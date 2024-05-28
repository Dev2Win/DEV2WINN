import { Schema, model, models } from "mongoose";


const MentorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
    career_preferences: [{type: String , required : false}],
     industry_pref: [{type:String, required: false }],
     expertise: [{ type :String, required: false }], 
     education: [{ type :String, required: false }],
     experience_level:{ type:String, required : false }, 
     work_experience: [{ type :String, required: false }], 
     availability: [{ type :String, required: false }],
    date: { type: Date, default: Date.now },
   
});

const Mentor = models.Mentor || model("Mentor", MentorSchema)

export default Mentor
