const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .send("Yor are not logged in! Please log in to get access.");
    }

    const data = await promisfy(jwt.verify)(token, process.env.JWT_KEY);
    
    const admin = await Admin.findOne({ _id: data._id, "tokens.token": token });
    if (!admin) {
      throw new Error();
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Your're not authorised to access this" });
  }
};
