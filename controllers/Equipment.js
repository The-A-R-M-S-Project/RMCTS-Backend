const Admin = require("../models/admin");
const Item = require("../models/item");
const multer = require("../middlewares/multer");
const cloudinary = require("../config/cloudinaryConfig");

exports.addItem = async (req, res) => {
  try {
    itm = req.body;
    const file = multer.dataURI(req).content;
    const result = await cloudinary.uploader.upload(file);
    itm.imageURL = result.secure_url;
    itm.imageID = result.public_id;
    const item = new Item(itm);
    item.userId = await req.admin._id;
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    const owner = await Admin.findOne({ _id: item.userId });
    res.status(200).send([
      item,
      {
        ownerName: owner.name,
        ownerEmail: owner.email,
        ownerContact: owner.contact,
      },
    ]);
    // res.status(200).send(item)
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
      res
        .status(responseDueToNotFound().status)
        .json(responseDueToNotFound().message);
    } else {
      const file = multer.dataURI(req).content;
      const result = await cloudinary.uploader.upload(file);
      item.imageURL = result.secure_url;
      item.imageID = result.public_id;
      item.title = req.body.title;
      item.location = req.body.location;
      item.description = req.body.description;
      item.userId = await req.admin._id;
      await item.save();
      res.status(200).json(item);
    }
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Item.findByIdAndDelete(id);
    if (!response) {
      res
        .status(responseDueToNotFound().status)
        .json(responseDueToNotFound().message);
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.getQueryMatch = async (req, res) => {
  Item.search(req.body.search, function (err, data) {
    // console.log(data);
    // console.log(req.body.search)
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(data);
    }
  });
};

exports.getCatalogDefault = async (req, res) => {
  try {
    Item.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .exec(function (error, data) {
        if (error) {
          res.status(400).send(error);
        } else {
          res.status(200).send(data);
        }
      });
  } catch (error) {
    res.send(error);
  }
};

exports.makeReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = req.body;

    reservation.reserverId = await req.admin._id.toString();
    const item = await Item.findById(id);

    // checking if dates are already occupied
    reservationsArray = item.reservations;
    if (
      reservationsArray.filter((v) => v.start == req.body.start).length > 0 ||
      reservationsArray.filter((v) => v.end == req.body.end).length > 0
    ) {
      res.status(400).send("date already taken");
    } else {
      // ensuring date is not within an already occupied period
      selectedStart = new Date(req.body.start);
      selectedEnd = new Date(req.body.end);
      console.log("dates ", selectedEnd, selectedStart);
      for (i of reservationsArray) {
        // existing dates
        iStart = new Date(i.start);
        iEnd = new Date(i.end);
        if (
          (iStart <= selectedStart && selectedStart <= iEnd) ||
          (iStart <= selectedEnd && selectedEnd <= iEnd)
        ) {
          res.status(400).send("time slot already occupied");
        }
      }
      // Adding reservation
      await item.reservations.push(reservation);
      await item.save();
      res.status(200).send(item);
    }
  } catch (error) {
    res.send(error);
  }
};

exports.getReservations = async (req, res) => {
  try {
    const items = await Item.find({ "reservations.reserverId": req.admin._id });
    // console.log(items)
    reservations = [];
    for (i of items) {
      reservations.push(...i.reservations);
    }

    res.status(200).send(reservations);
  } catch (error) {
    res.status(404).send(error);
  }
};

exports.getBookings = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.admin._id });
    reservations = [];
    for (i of items) {
      reservations.push(...i.reservations);
    }
    res.status(200).send(reservations);
  } catch (error) {
    res.status(404).send(error);
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    console.log(req.body);
    item_id = req.body.itemID;
    console.log(item_id);
    reservation_id = req.body.reservationID;
    const item = await Item.findById(item_id);
    // console.log(item);
    item.reservations.splice(0, item.reservations.length);
    await item.save();
    console.log(item);
    // await item.reservations.id(reservation_id).remove();
    // await item.save()
    // console.log(items.reservations)
    // if (!response) {
    //   res
    //     .status(responseDueToNotFound().status)
    //     .json(responseDueToNotFound().message);
    // } else {
    //   res.status(200).json(response);
    // }
    res.status(200).send(item);
  } catch (error) {
    res.send(error);
  }
};
