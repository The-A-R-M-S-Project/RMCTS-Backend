const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  contact: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
  },
  profileImage: {
    type: String,
    required: true
  },
  profileImageID: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});


// Hashing password before saving the admin model
adminSchema.pre("save", async function(next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

// Generating an authentication token for the admin
adminSchema.methods.generateAuthToken = async function() {
  const admin = this;
  const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY);
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

// Searching for the admin by email and password.
adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
