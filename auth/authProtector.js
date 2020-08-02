const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .send("Yor are not logged in! Please log in to get access.");
    }

    const data = await promisfy(jwt.verify)(token, process.env.JWT_KEY);
    
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Your're not authorised to access this" });
  }
};
