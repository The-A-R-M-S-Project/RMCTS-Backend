const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  faceCode: {
    type: String
  },
  contact: {
    type: String,
  },
  websiteURL: {
    type: String,
  },
  bio: {
    type: String
  },
  profileImage: {
    type: String,
  },
  profileImageID: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ["institution", "individual"],
    default: "institution",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Hashing password before saving the user model
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  //Harshing face code
  if (user.isModified("faceCode")) {
    user.faceCode = await bcrypt.hash(user.faceCode, 10);
  }
  next();
});

// Searching for the user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

// Searching for the user by email and face_code
userSchema.statics.findByAttributes = async (email, faceCode) => {
  const user = await User.findOne({email});
  if (!user){
    throw new Error({ error: "Invalid login credentials"});
  }
  const isfaceCodeMatch = await bcrypt.compare(faceCode, user.faceCode)
  if(!isfaceCodeMatch){
    throw new Error({error: "Face doesn't match the account owner's!"})
  }
  return user;
}

const User = mongoose.model("user", userSchema);

module.exports = User;
