import User from "../models/user.js";

export const makeUser = async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({username: name, emailID: email});

  try {
    const registeredNewUser = await User.register(newUser, password);
    return res.json({
      success: true,
      user: registeredNewUser
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err
    });
  }
};

export const runUser = async (req, res) => {
  return res.json({
    success: true,
  });
};