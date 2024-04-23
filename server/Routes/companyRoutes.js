import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, signIn, getCompanyProfile, getCompanies, getCompanyJobListing, getCompanyById, updateCompanyProfile } from '../Controllers/companyController.js';
import userAuth from '../middlewares/authMiddleware.js';

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again in 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", limiter, register);
router.post("/login", limiter, signIn);
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.post("/get-company-job-listings", userAuth, getCompanyJobListing);
router.get("/", getCompanies);
router.get("/get-company-by-id/:id", getCompanyById);

router.put("/update-company-profile", userAuth, updateCompanyProfile);

export default router;