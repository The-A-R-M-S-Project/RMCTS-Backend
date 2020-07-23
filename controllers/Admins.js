const Admin = require("../models/admin");
const multer = require("../middlewares/multer");
const cloudinary = require("../config/cloudinaryConfig");

exports.createNewAdmin = async (req, res) => {
  try {
    const adm = req.body;
    const file = await multer.dataURI(req).content;

    await cloudinary.uploader.upload(file);
    adm.profileImage = result.secure_url;
    adm.profileImageID = result.public_id;

    const admin = new Admin(adm);
    await admin.save();

    return res.status(200).json({
      message: "Your account has been created successfully",
      admin: admin,
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

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByCredentials(email, password);
    if (!admin) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (error) {
    res.status(400).send(error);
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
  } catch (err) {
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
