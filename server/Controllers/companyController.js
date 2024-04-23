import mongoose from "mongoose"
import Companies from "../Models/companiesModel.js"

//POST: Register - works
export const register = async (req, res, next) => {
    const { name, email, password } = req.body

    switch (true) {
        case !name:
            return next("Company name is required")
        case !email:
            return next("Email is required")
        case !password:
            return next("Password is required")
    }

    try {
        const accountExists = await Companies.findOne({ email })

        if (accountExists) {
            return next("Email Address already exists")
        }

        const company = await Companies.create({
            name,
            email,
            password
        })

        const token = company.getSignedToken()

        res.status(201).json({
            status: "Succeeded",
            message: "Account created successfully",
            user: {
                _id: company._id,
                name: company.name,
                email: company.email
            },
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: "Failed", message: error.message })
    }
}

//POST: Login - works
export const signIn = async (req, res, next) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return next("Please provide user credentials")
        }

        // Find company by email
        const company = await Companies.findOne({ email }).select("+password")

        if (!company) {
            return next("Company account doesn't exist")
        }

        // Compare passwords
        const isMatch = await company.comparePassword(password)

        if (!isMatch) {
            return next("Invalid email or password")
        }

        company.password = undefined
        const token = company.getSignedToken()

        res.status(201).json({
            status: "Succeeded",
            message: "Login successful",
            user: company,
            token,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: "Failed", message: error.message })
    }
}

//PUT: Update company information - works
export const updateCompanyProfile = async (req, res, next) => {
    const { name, contact, location, profileUrl, about } = req.body

    try {
        if (!name || !contact || !location || !profileUrl || !about) {
            return next("Please provide all required fields")
        }

        const id = req.body.user.userId

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).next({
                status: "Failed",
                message: "Company not found"
            })
        }

        const updateCompany = {
            name, contact, location, profileUrl, about, _id: id
        }

        const company = await Companies.findByIdAndUpdate(id, updateCompany, { new: true })

        if (!company) {
            return res.status(404).send({
                status: "Failed",
                message: "Company not found"
            });
        }

        const token = company.getSignedToken()
        company.password = undefined

        res.status(200).json({
            status: "Succeeded",
            message: "Company profile updated successfully",
            company,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: "Failed", message: error.message })
    }
}

//POST: Gets company's profile - works
export const getCompanyProfile = async (req, res, next) => {
    try {
        const id = req.body.user.userId;
        const company = await Companies.findById({ _id: id });

        if (!company) {
            return res.status(404).send({
                status: "Failed",
                message: "Company Not Found"
            });
        }

        company.password = undefined;
        res.status(200).json({
            status: "Succeeded",
            data: company,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "Failed", message: error.message })
    }
};

//GET: Get all companies - works
export const getCompanies = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;

        //conditons for searching filters
        const queryObject = {};

        if (search) {
            queryObject.name = { $regex: search, $options: "i" };
        }

        if (location) {
            queryObject.location = { $regex: location, $options: "i" };
        }

        let queryResult = Companies.find(queryObject).select("-password");

        // SORTING
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if (sort === "A-Z") {
            queryResult = queryResult.sort("name");
        }
        if (sort === "Z-A") {
            queryResult = queryResult.sort("-name");
        }

        // PADINATIONS
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        // records count
        const total = await Companies.countDocuments(queryResult);
        const numOfPage = Math.ceil(total / limit);
        // move next page
        // queryResult = queryResult.skip(skip).limit(limit);

        // show mopre instead of moving to next page
        queryResult = queryResult.limit(limit * page);

        const companies = await queryResult;

        res.status(200).json({
            status: "Succeeded",
            total,
            data: companies,
            page,
            numOfPage,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "Failed", message: error.message })
    }
};

//POST: Get job listings
export const getCompanyJobListing = async (req, res, next) => {
    const { search, sort } = req.query;
    const id = req.body.user.userId;

    try {
        //conditons for searching filters
        const queryObject = {};

        if (search) {
            queryObject.location = { $regex: search, $options: "i" };
        }

        let sorting;
        //sorting || another way
        if (sort === "Newest") {
            sorting = "-createdAt";
        }
        if (sort === "Oldest") {
            sorting = "createdAt";
        }
        if (sort === "A-Z") {
            sorting = "name";
        }
        if (sort === "Z-A") {
            sorting = "-name";
        }

        let queryResult = await Companies.findById({ _id: id }).populate({
            path: "jobPosts",
            options: { sort: sorting },
        });
        const companies = await queryResult;

        res.status(200).json({
            status: "Succeeded",
            companies: {
                name: companies.name,
                jobPosts: companies.jobPosts,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "Failed", message: error.message })
    }
};

//POST: Get company by id
export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const company = await Companies.findById({ _id: id }).populate({
            path: "jobPosts",
            options: {
                sort: "-_id",
            },
        });

        if (!company) {
            return res.status(200).send({
                status: "Failed",
                message: "Company Not Found"
            });
        }

        company.password = undefined;

        res.status(200).json({
            status: "Succeeded",
            data: company,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: "Failed", message: error.message })
    }
};