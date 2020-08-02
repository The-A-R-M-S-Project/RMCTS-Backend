const jwt = require("jsonwebtoken");
const User = require("../models/admin");

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
    //   const file = await multer.dataURI(req).content;

    //   await cloudinary.uploader.upload(file);
    //   adm.profileImage = result.secure_url;
    //   adm.profileImageID = result.public_id;

    // Cheking if account already exists
    Admin.findOne({ email: usr.email }, async function (err, user) {
      if (user)
        return res.status(400).send({
          msg:
            "The email address you have entered is already associated with another account",
        });

      // Create account
      user = new User(usr);
      await user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Create a verification token for this account
        var token = new Token({
          _userId: user._id,
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
            to: user.email,
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
                "A verification email has been sent to " + user.email + "."
              );
          });
        });
      });
    });
  } catch (err) {
    res.status(400).json({
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

exports.logout = async (req, res) => {
  return (req, res) => {
    res.cookie("jwt", "no-auth", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  };
};

module.exports = AuthController;
