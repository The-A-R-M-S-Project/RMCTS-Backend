const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("./config/cloudinaryConfig");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const equipmentRoutes = require("./routes/equipment");
const userRoutes = require("./routes/user");
// const connectMongo = require('./utils/database').connectMongo;
require("dotenv").config();

const app = express();

//--------------- protection from attacks ----------------
// limits requests from one user
const limit = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests made in the previous hour",
});

//limits all routes
app.use("/", limit);

// Data sanitization agains XSS
app.use(helmet());
app.use(xss());

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

//-------------------------------------------------------
app.use("*", cloudinary.cloudinaryConfig);

// -------------- parse data ----------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -------------- use cookies ---------------------------
app.use(cookieParser())
// ---------------- ENABLE CORS -------------------------
app.use(cors())
//--------------------- logs ----------------------------
app.use(morgan("tiny"));

//------------------routes-------------------------------
app.get("/", (req, res) => {res.json({msg: "RMCTS API"})})
app.use("/equipment", equipmentRoutes);
app.use("/users", userRoutes);

module.exports = app;
