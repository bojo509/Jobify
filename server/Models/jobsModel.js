import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        //Refers to the companies model
        ref: "Companies",
        required: [true, "Please enter the company"],
    },
    jobTitle: {
        type: String,
        required: [true, "Please enter job title"],
    },
    jobType: {
        type: String,
        required: [true, "Please enter job type"],
    },
    location: {
        type: String,
        required: [true, "Please enter job location"],
    },
    salary: {
        type: Number,
        min: [0, "salary can't be negative"],
        required: [true, "Please enter job salary"],
    },
    vacancies: {
        type: Number,
        min: [0, "vacancies can't be negative"]
    },
    experience: {
        type: Number,
        min: [0, "you can't have negative experience"],
        default: 0
    },
    desc: {
        type: String,
    },
    requirements: { 
        type: String 
    },
    applicants: [{ type: Schema.Types.ObjectId, ref: "Users" }]
}, { timestamps: true });

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;