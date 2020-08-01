const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("./config/cloudinaryConfig");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");

const equipmentRoutes = require("./routes/equipment");
const adminRoutes = require("./routes/admins");
// const connectMongo = require('./utils/database').connectMongo;
require("dotenv").config();

const port = process.env.PORT || 3000;

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

// ---------------- ENABLE CORS -------------------------
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//--------------------- logs ----------------------------
app.use(morgan("tiny"));

//------------------routes-------------------------------
app.use(equipmentRoutes);
app.use("/admins", adminRoutes);

module.exports = app;
