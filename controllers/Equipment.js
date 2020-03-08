// const Admin = require('../models/admin')
const Item = require("../models/item");

exports.addItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    item.userId = await req.admin._id;
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.getUserEquipment = async (req, res) => {
  try {
    const equipment = await Item.find({ userId: req.admin._id });
    res.json(equipment);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.updateItem = async (req, res) => {
  try {
    const id = req.body._id;
    const item = await Item.findById(id);
    if (!item) {
      res.status(responseDueToNotFound().status).json(response.message);
    } else {
      item.title = req.body.title;
      item.location = req.body.location;
      item.imageURL = req.body.imageURL;
      item.description = req.body.description;
      item.userId = await req.admin._id;
      await item.save();
      res.status(200).json(item);
    }
  } catch (error) {
    res.status(404).json(error);
    console.log("3");
  }
};
