const Admin = require('../models/admin')

exports.getItem = (req, res, next) => {
  res.json({
    Equipment: [
      {
        _id: "01",
        title: "equipment1",
        description: "This is an electronics workbench",
        location: "Makindye",
        imageURL:
          "https://images.unsplash.com/photo-1454976635780-7d49710daa1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        owner: {
          name: "Wycliff"
        }
      }
    ]
  });
};

exports.createNewAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    const token = await admin.generateAuthToken();
    res.status(201).send({ admin, token });
  } catch (error) {
    res.status(400).send(error);
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
    res.send({ admin, token});
  } 
  catch (error) {
    res.status(400).send(error);
    // console.log(error)
  }
};
