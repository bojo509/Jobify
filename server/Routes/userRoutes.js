import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { getUser, updateUser, deleteUser, getUserAsACompany } from '../Controllers/userController.js';


const router = express.Router();

// Using userAuth as a middleware
// Requires a token because of userAuth middleware
router.post("/get-user", userAuth, getUser);

// Requires a token and all fields to have a value
router.put("/update-user", userAuth, updateUser);
router.delete("/delete-user/:id", deleteUser)
router.get("/get-user/:id", getUserAsACompany)

export default router;