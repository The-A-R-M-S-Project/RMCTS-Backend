const mongoose = require("mongoose");
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION");
    console.log(err.name, err.message);
    process.exit(1);
  });
}

dotenv.config();
//connects server to app.js
const app = require("./app");

// configure databases

let DB =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_PRODUCTION
    : process.env.DATABASE_LOCAL;

if (process.env.NODE_ENV === "test"){
    DB = process.env.DATABASE_TEST;
}

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => "Database connection successfully established"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log("App is running on port " + port);
})