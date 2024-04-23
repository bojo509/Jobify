import express from 'express';
import { deleteAllJobs, deleteCompanyProfile } from '../Controllers/devController.js';

const router = express.Router();

router.delete('/delete-all-jobs/:id', deleteAllJobs);
router.delete('/delete-company-profile/:id', deleteCompanyProfile);

export default router;