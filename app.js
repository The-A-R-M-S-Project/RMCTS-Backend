const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const equipmentRoutes = require("./routes/equipment");
const adminRoutes = require("./routes/admins");
// const connectMongo = require('./utils/database').connectMongo;
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//------------------routes-------------------------------
app.use(equipmentRoutes);
app.use("/admins", adminRoutes);

//------------------establishing connection------------------

// connectMongo(() => {
//     app.listen(3000);
// });
mongoose
  .connect(
    "mongodb+srv://wycliff:hBgOZXRI6a73R9lG@rmcts-qwjac.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .then(result => {
    app.listen(port);
    console.log("App is running on port 3000");
  })
  .catch(err => {
    console.log(err);
  });
