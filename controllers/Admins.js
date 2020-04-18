const Admin = require('../models/admin')
const multer = require('../middlewares/multer')
const cloudinary = require('../config/cloudinaryConfig')


exports.createNewAdmin = (req, res) => {

  const adm = req.body
  const file = multer.dataURI(req).content;

  cloudinary.uploader.upload(file).then((result) => {
    adm.profileImage = result.secure_url;
    adm.profileImageID = result.public_id

    const admin = new Admin(adm);
    admin.save();

    return res.status(200).json({
      message: 'Your account has been created successfully',
      admin: admin
    })
  }).catch((err) => res.status(400).json({
    message: 'someting went wrong while processing your request',
    data: {
      err
    }
  }))
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
  }
  catch (error) {
    res.status(400).send(error);
    // console.log(error)
  }
};
