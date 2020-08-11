const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user");

module.exports = () => {
  return async (req, res, next) => {
    try {
      let token;
      // Checking for token existence
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.replace("Bearer ", "");
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      // verify token
      if (!token) {
        return next(
          res
            .status(401)
            .send("You are not logged in! Please log in to get access.")
        );
      }

      const data = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      const user = await User.findById(data.id);
      if (!user) {
        next(
          res
            .status(401)
            .status("User belonging to this token no longer exists")
        );
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      next(
        res.status(401).send({ error: error })
      );
    }
  };
};
