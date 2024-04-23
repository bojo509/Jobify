import mongoose, { Schema } from "mongoose";
import validator from "validator";
import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import jwt from "jsonwebtoken";

const companySchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your company name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: true,
    },
    contact: {
        type: String
    },
    location: {
        type: String
    },
    profileUrl: {
        type: String,   
        default: "https://res.cloudinary.com/docscbcto/image/upload/v1712236460/JobifyApp/bnpuuomlttvfyrkpmtdt.png"
    },
    about: {
        type: String
    },
    jobPosts: [{type: Schema.Types.ObjectId, ref: "Jobs"}]
}, { timestamps: true });

// Hash password before saving
companySchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    const salt = await genSalt(10)
    this.password = await hash(this.password, salt)
});

// Check password
companySchema.methods.comparePassword = async function (userPassword) {
    return await compare(userPassword, this.password);
};

// JWT token generation
companySchema.methods.getSignedToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
}

const Companies = mongoose.model("Companies", companySchema);

export default Companies;