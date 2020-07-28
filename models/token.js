const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Admin"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
})

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;