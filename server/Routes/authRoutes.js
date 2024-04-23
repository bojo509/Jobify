import express from "express";
import { rateLimit } from "express-rate-limit";
import { register, signIn } from "../Controllers/authController.js";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again in 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.post("/register", limiter, register);
router.post("/login", limiter, signIn);

export default router;
