const User = require("../models/user");
const multer = require("../middlewares/multer");
const cloudinary = require("../config/cloudinaryConfig");
const Token = require("../models/token");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

exports.confirmEmail = async (req, res) => {
  try {
    // find the token
    const token = await Token.findOne({ token: req.params.token });
    if (!token)
      return res
        .status(400)
        .sendFile(path.join(__dirname, "..", "/static/invalid.html"));

    // If token exists
    const user = await User.findOne({ _id: token._userId });

    if (!user)
      return res
        .status(400)
        .sendFile(path.join(__dirname, "..", "/static/invalidUser.html"));

    if (user.isVerified)
      return res
        .status(400)
        .sendFile(path.join(__dirname, "..", "/static/alreadyVerified.html"));

    // Verifiy account
    user.isVerified = true;

    await user.save();

    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "/static/verified.html"));
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resendToken = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        msg: "We were unable to find account associated with this email",
      });

    if (user.isVerified)
      return res
        .status(400)
        .json({ msg: "This account has already been verified" });

    //Create a verification token
    const token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    //Save token
    await token.save();

    // Send the email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: "no-reply@rmcts.com",
      to: user.email,
      subject: "Account Verification Token",
      text:
        "Hello,\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/users/confirmation/" +
        token.token +
        ".\n",
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "A verification email has been sent to " + user.email + ".",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const file = await multer.dataURI(req).content;

    const result = await cloudinary.uploader.upload(file);

    const user = await User.findOne({ _id: req._id });
    user.profileImage = result.secure_url;
    user.profileImageID = result.public_id;

    await user.save();
    res.status(200).send({ msg: "Profile image successfully updated" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(responseDueToNotFound().status)
        .json(responseDueToNotFound().message);
    } else {
      user.username = req.body.username;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.contact = req.body.contact;
      user.bio = req.body.bio;
      user.websiteURL = req.body.websiteURL;
      user.address = req.body.address;
      await user.save();
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(responseDueToNotFound().status)
        .json(responseDueToNotFound().message);
    }
    let {
      username,
      firstname,
      lastname,
      contact,
      bio,
      website,
      address,
    } = user;
    return res
      .status(200)
      .json({ username, firstname, lastname, contact, bio, website, address });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateUserFaceCode = async(req, res) => {
  try{
    const faceCode = req.body.faceCode
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
      return res
        .status(responseDueToNotFound().status)
        .json(responseDueToNotFound().message);
    }
    else {
      user.faceCode = faceCode;
      await user.save();
      return res.status(200).send(user);
    }
  }catch(error){
    return res.status(400).send(error);
  }
}