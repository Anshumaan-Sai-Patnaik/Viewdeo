import User from "../models/user.js";

export const makeUser = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    const user = await User.create({
      username: name,
      emailID: email,
      password: password
    });

    return res.json({
      success: true,
      user: user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
