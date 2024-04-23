import Companies from "../Models/companiesModel.js";
import Jobs from "../Models/jobsModel.js";
import mongoose from "mongoose";

export const deleteAllJobs = async (req, res) => {
    const { id } = req.params;
    try {
      // Delete jobs from the database
      await Jobs.deleteMany({ company: id });
  
      // Find the company and update jobPosts array
      const company = await Companies.findById(id);
      company.jobPosts = [];
      await company.save();
  
      res.status(200).json({ status: "Succeeded", message: 'All jobs deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting jobs' });
    }
};

export const deleteCompanyProfile = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No Company with id: ${id}`);
  
      const company = await Companies.findById(id);
  
      if (!company) {
        return res.status(404).send({
          status: "Failed",
          message: "Company Not Found"
        });
      }
  
      await Companies.deleteOne({ _id: id });
  
      res.status(200).send({
        status: "Succeeded",
        message: "Company Profile Deleted Successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ status: "Failed", message: error.message })
    }
  };