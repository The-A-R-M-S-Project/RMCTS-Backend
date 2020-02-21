const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    imageURL: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  { timestamps: true }
);

Item = mongoose.model("Item", itemSchema);
module.exports = Item;
