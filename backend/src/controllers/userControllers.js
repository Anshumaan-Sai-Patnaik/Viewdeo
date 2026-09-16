import User from "../models/user.js";

export const makeUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({username: name, emailID: email});

    const registeredNewUser = await User.register(newUser, password);
    req.login(registeredNewUser, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
      return res.json({
        success: true
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message || "An error occurred during signup."
    });
  }
};

export const runUser = async (req, res) => {
  return res.json({
    success: true,
  });
};

export const getUser = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false
    });
  }

  return res.json({
    success: true,
    user: req.user
  });
};