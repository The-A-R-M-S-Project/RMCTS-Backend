const jwt = require("jsonwebtoken");
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

      const data = await promisfy(jwt.verify)(token, process.env.JWT_KEY);

      const user = await User.findOne({ _id: data._id, "tokens.token": token });
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
        res.status(401).send({ error: "Your're not authorised to access this" })
      );
    }
  };
};
