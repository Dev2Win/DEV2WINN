import { Schema, model, models } from "mongoose";

const CourseSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    modules: { type: Number, required: true },
})

const Course = models.Course || model("Course", CourseSchema)
export default Course