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