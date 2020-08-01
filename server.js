const mongoose = require('mongoose');
const dotenv = require('dotenv');


if (process.env.NODE_ENV !== "test"){
    process.on('uncaughtException', err => {
        console.log("UNCAUGHT EXCEPTION");
        console.log(err.name, err.message);
        process.exit(1);
    })
}
