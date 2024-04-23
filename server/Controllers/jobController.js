import mongoose from "mongoose";
import Jobs from "../Models/jobsModel.js";
import Companies from "../Models/companiesModel.js";

//POST: Upload a job - works
export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !requirements ||
      !desc
    ) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc, 
      requirements,
      company: id,
    };

    const job = new Jobs(jobPost);
    await job.save();

    //update the company information with job id
    const company = await Companies.findById(id);

    company.jobPosts.push(job._id);
    const updateCompany = await Companies.findByIdAndUpdate(id, company, {
      new: true,
    });

    res.status(200).json({
      status: "Succeeded",
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { jobId } = req.params;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !desc ||
      !requirements
    ) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
      _id: jobId,
    };

    await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

    res.status(200).json({
      status: "Succeeded",
      message: "Job Post Updated Successfully",
      jobPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(","); //full-time,part-time
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.jobType = { $in: types };
    }

    //    [2. 6]

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]) - 1,
        $lte: Number(experience[1]) + 1,
      };
    }

    if (search) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { jobType: { $regex: search, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password",
    });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //records count
    const totalJobs = await Jobs.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    queryResult = queryResult.limit(limit * page);

    const jobs = await queryResult;

    res.status(200).json({
      status: "Succeeded",
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return res.status(400).send({
        status: "Failed",
        message: "Job Post Not Found"
      });
    }

    //GET SIMILAR JOB POST
    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
        { jobType: { $regex: job?.jobType, $options: "i" } },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      status: "Succeeded",
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const job = await Jobs.findById(id);

      if (!job) {
        return res.status(404).send({
          status: "Failed",
          message: "Job Post Not Found"
        });
      }

      await Jobs.deleteOne({ _id: id });

      res.status(200).send({
        status: "Succeeded",
        message: "Job Post Deleted Successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Job with id: ${id}`);

    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).send({
        status: "Failed",
        message: "Job Post Not Found"
      });
    }

    // Add the user's ID to the applicants array if it's not already there
    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }
    else{
      return res.status(400).send({
        status: "Failed",
        message: "You have already applied to this job"
      });
    }

    res.status(200).json({
      status: "Succeeded",
      message: "Applied to Job Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const userId = req.body.user.userId;  // Get the user's ID from the request object

    // Find all jobs where the applicants array contains the user's ID
    const jobs = await Jobs.find({ applicants: { $in: [userId] } }).populate('company', 'profileUrl name -password');

    res.status(200).json({
      status: "Succeeded",
      message: "Retrieved Applied Jobs Successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const checkApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.user.userId;  // Get the user's ID from the request object

    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).send({
        status: "Failed",
        message: "Job Post Not Found"
      });
    }

    // Check if the user's ID is in the applicants array
    const hasApplied = job.applicants.includes(userId);

    res.status(200).json({
      status: "Succeeded",
      hasApplied: hasApplied
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};


export const getApplicants = async (req, res, next) => {
  try {
    const { id } = req.params;  // Get the job's ID from the request object
    const userId = req.body.user.userId;  // Get the user's ID from the request object

    // Find the job by its ID and populate the applicants field
    const job = await Jobs.findById(id).populate('applicants');

    if (!job) {
      return res.status(404).send({
        status: "Failed",
        message: "Job Post Not Found"
      });
    }

    if (job.company.toString() !== userId) {
      return res.status(403).send({
        status: "Failed",
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      status: "Succeeded",
      message: "Retrieved Applicants Successfully",
      applicants: job.applicants,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};