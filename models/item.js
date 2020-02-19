const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const itemSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      required: true
    },
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
    Description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
