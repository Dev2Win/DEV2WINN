import { Schema, model, models} from "mongoose";


 const MenteeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  career_path:{type: String, required: false },
  desired_skills: [{ type:String, required: false }],
  experience_level:{type:String, required: false }, // novice , experienced , professional
  industry_pref: [{type:String, required: false }], // health , agriculture , mines , law , based on career choice
  availability: [{ type :String, required: false }], // weekdays and weekends and everyday 
  education_status:{type:String, required: false },// degree , high school diploma , masters , phd
 
});

const Mentee = models.Mentee || model("Mentee", MenteeSchema)
export default Mentee