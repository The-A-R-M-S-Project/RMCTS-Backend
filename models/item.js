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
      // required: true
    },
    imageID:{
      type: String,
      // required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Admin"
    },
    reservations: [
      {
        start: {
          type: String,
          unique: true
        },
        end: {
          type: String,
          unique: true
        },
        reserverId: {
          type: Schema.Types.ObjectId,
          ref: "Admin"
        },
        title: String,
        description: String,
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Item"
        }
      }
    ]
  },
  { timestamps: true }
);
itemSchema.index(
  { title: "text", description: "text" },
  { weights: { title: 5, body: 3 } }
);
itemSchema.statics = {
  searchPartial: function(q, callback) {
    return this.find(
      {
        $or: [{ title: new RegExp(q, "gi") }, { body: new RegExp(q, "gi") }]
      },
      callback
    );
  },
  searchFull: function(q, callback) {
    return this.find(
      {
        $text: {
          $search: q,
          $caseSensitive: false
        }
      },
      callback
    );
  },
  search: function(q, callback) {
    this.searchPartial(q, (err, data) => {
      if (err) return callback(err, data);
      if (!err && data.length) return callback(err, data);
      if (!err && data.length === 0) return this.searchPartial(q, callback);
    });
  }
};
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
