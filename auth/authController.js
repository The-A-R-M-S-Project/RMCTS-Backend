const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
  });
};


const SendToken = (user, status, res) => {
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


class AuthController {

  constructor(User) {
    this.User = User;
  }

  
}
module.exports = AuthController;
