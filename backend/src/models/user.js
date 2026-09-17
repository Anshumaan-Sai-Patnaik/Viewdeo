import mongoose from "mongoose";
import passportLocalMongoosePackage from "passport-local-mongoose";

const passportLocalMongoose = passportLocalMongoosePackage.default;

const userSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  emailID: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "emailID",
  errorMessages: {
    UserExistsError: "A user with the given email ID is already registered",
    MissingUsernameError: "No email ID was given",
    IncorrectPasswordError: "Password or email ID are incorrect",
    IncorrectUsernameError: "Password or email ID are incorrect"
  }
});

export default mongoose.model("User", userSchema);