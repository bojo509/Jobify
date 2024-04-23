import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { createJob, updateJob, deleteJobPost, getJobById, getJobPosts, applyToJob, getApplications, checkApplication, getApplicants } from "../Controllers/jobController.js";

const router = express.Router();

//JWT required
router.post("/upload-job", userAuth, createJob)
router.post("/apply/:id", userAuth, applyToJob)
router.put("/update-job/:id", userAuth, updateJob)
router.get("/find-jobs", getJobPosts)
router.get("/get-job-details/:id", getJobById)
router.get("/get-applications", userAuth, getApplications)
router.get("/check-application/:id", userAuth, checkApplication)
router.get("/get-applicants/:id", userAuth, getApplicants)
router.delete("/delete-job/:id", deleteJobPost)

export default router
