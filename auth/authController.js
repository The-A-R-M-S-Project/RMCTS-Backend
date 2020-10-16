const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
  });
};

const sendToken = (user, status, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60000),
    httpOnly: true, // send token via HTTPOnly cookie
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // Remove user password before output
  res.status(status).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const usr = req.body;

    // Cheking if account already exists
    let user = await User.findOne({ email: usr.email });

    if (user)
      return res.status(400).json({
        msg:
          "The email address you have entered is already associated with another account",
      });

    // Create account
    user = new User(usr);
    await user.save();

    // Create a verification token for this account
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();

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

    return res.status(200).json({
      msg: "A verification email has been sent to " + user.email + ".",
    });
  } catch (err) {
    res.status(500).json({
      message: "someting went wrong while processing your request",
      data: {
        err,
      },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    if (!user.isVerified)
      return res.status(401).send({
        type: "not-verified",
        msg: "This account has not been verified",
      });
    // const token = await admin.generateAuthToken();
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.loginWithFace = async (req, res) => {
  try {
    const { email, face_code } = req.body;
    const user = await User.findByAttributes(email, face_code);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check your details." });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "no-auth", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

exports.restricTo = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return next(
        res
          .status(403)
          .send("You do not have permission to perform this action")
      );
    }
    next();
  };
};
