const Admin = require("../models/admin");
const multer = require("../middlewares/multer");
const cloudinary = require("../config/cloudinaryConfig");
const Token = require("../models/token");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

exports.createNewAdmin = async (req, res) => {
  try {
    const adm = req.body;
    const file = await multer.dataURI(req).content;

    await cloudinary.uploader.upload(file);
    adm.profileImage = result.secure_url;
    adm.profileImageID = result.public_id;

    // Cheking if account already exists
    Admin.findOne({ email: adm.email }, async function (err, admin) {
      if (admin)
        return res.status(400).send({
          msg:
            "The email address you have entered is already associated with another account",
        });

      // Create account
      admin = new Admin(adm);
      await admin.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Create a verification token for this account
        var token = new Token({
          _userId: admin._id,
          token: crypto.randomBytes(16).toString("hex"),
        });

        // Save the verification token
        token.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }

          // Send email
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_ACCOUNT,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          let mailOptions = {
            from: "no-reply@rmcts.com",
            to: admin.email,
            subject: "Account Verification Token",
            text:
              "Hello,\n\n" +
              "Please verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/admins/confirmation/" +
              token.token +
              ".\n",
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            res
              .status(200)
              .send(
                "A verification email has been sent to " + admin.email + "."
              );
          });
        });
      });
    });

    // return res.status(200).json({
    //   message: "Your account has been created successfully",
    //   admin: admin,
    // });
  } catch (err) {
    res.status(400).json({
      message: "someting went wrong while processing your request",
      data: {
        err,
      },
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByCredentials(email, password);
    if (!admin) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    if (!admin.isVerified)
      return res.status(401).send({
        type: "not-verified",
        msg: "This account has not been verified",
      });
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (error) {
    return res.status(400).send(error);
    // console.log(error)
  }
};

exports.logout = async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.admin.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.admin.tokens.splice(0, req.admin.tokens.length);
    await req.admin.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    // find the token
    Token.findOne({ token: req.params.token }, async function (err, token) {
      if (!token)
       
        return res
          .status(400)
          .sendFile(path.join(__dirname, "..", "/static/invalid.html"));

      // If token exists
      Admin.findOne({ _id: token._userId }, async function (err, admin) {
        if (!admin)
         
          return res
          .status(400)
          .sendFile(path.join(__dirname, "..", "/static/invalidUser.html"));
        if (admin.isVerified)
          
          return res
          .status(400)
          .sendFile(path.join(__dirname, "..", "/static/alreadyVerified.html"));

        // Verifiy account
        admin.isVerified = true;
        admin.save(function (err) {
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
    Admin.findOne({ email: req.body.email }, async function (err, admin) {
      if (!admin)
        return res.status(400).send({
          msg: "We were unable to find account associated with this email",
        });
      if (admin.isVerified)
        return res
          .status(400)
          .send({ msg: "This account has already been verified" });
      //Create a verification token
      const token = new Token({
        _userId: admin._id,
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
          to: admin.email,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/admins/confirmation/" +
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
            .send("A verification email has been sent to " + admin.email + ".");
        });
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
