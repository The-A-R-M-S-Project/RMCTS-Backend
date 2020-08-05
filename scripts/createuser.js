const User = require("../models/user")

exports.createUser = async (data) => {
    const user = new User(data);
    await user.save();
    return user;
  };