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
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "emailID"
});

export default mongoose.model("User", userSchema);