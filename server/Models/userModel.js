import mongoose, { Schema } from "mongoose";
import validator from "validator";
import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
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
    accountType: {
        type: String,
        default: "seeker"
    },
    contact: {
        type: String
    },
    location: {
        type: String
    },
    profileUrl: {
        type: String,
        default: "https://res.cloudinary.com/docscbcto/image/upload/v1712489694/JobifyApp/ehxn4kco6lnz2hgjqprf.png"
    },
    cvUrl: {
        type: String
    },
    jobTitle: {
        type: String
    },
    about: {
        type: String
    },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    const salt = await genSalt(10)
    this.password = await hash(this.password, salt)
});

userSchema.pre("findOneAndUpdate", async function () {
    if (!this._update.password) {
        return
    }
    const salt = await genSalt(10)
    this._update.password = await hash(this._update.password, salt)
});

// Check password
userSchema.methods.comparePassword = async function (userPassword) {
    return await compare(userPassword, this.password);
};

// JWT token generation
userSchema.methods.getSignedToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
}

const Users = mongoose.model("Users", userSchema);

export default Users;