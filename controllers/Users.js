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
    Token.findOne({ token: req.params.token }, async function (err, token) {
      if (!token)
       
        return res
          .status(400)
          .sendFile(path.join(__dirname, "..", "/static/invalid.html"));

      // If token exists
      User.findOne({ _id: token._userId }, async function (err, user) {
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
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
     
          res.sendFile(path.join(__dirname, "..", "/static/verified.html"))
        });
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resendToken = async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, async function (err, user) {
      if (!user)
        return res.status(400).send({
          msg: "We were unable to find account associated with this email",
        });
      if (user.isVerified)
        return res
          .status(400)
          .send({ msg: "This account has already been verified" });
      //Create a verification token
      const token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      //Save token
      await token.save((err) => {
        if (err) return res.status(500).send({ msg: err.message });
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
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          res
            .status(200)
            .send("A verification email has been sent to " + user.email + ".");
        });
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
