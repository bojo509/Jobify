import Users from "../Models/userModel.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate fields
  switch (true) {
    case !firstName:
      return next("First Name is required");
    case !lastName:
      return next("Last Name is required");
    case !email:
      return next("Email is required");
    case !password:
      return next("Password is required");
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return next("Email Address already exists");
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = await user.getSignedToken();

    res.status(201).send({
      status: "Succeeded",
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next("Please provide user credentials");
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return next("User doesn't exist");
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    user.password = undefined;
    const token = user.getSignedToken();

    res.status(201).json({
      status: "Succeeded",
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: "Failed", message: error.message })
  }
};