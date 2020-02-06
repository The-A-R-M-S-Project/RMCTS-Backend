const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const catalogRoutes = require('./routes/catalog');
const consumerRoutes = require('./routes/consumer');
const adminRoutes = require('./routes/admin');
// const connectMongo = require('./utils/database').connectMongo;



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})


//------------------routes-------------------------------
app.use(catalogRoutes);
app.use(consumerRoutes);
app.use('/admin', adminRoutes);

//------------------establishing connection------------------

// connectMongo(() => {
//     app.listen(3000);
// });
mongoose
    .connect('mongodb+srv://ben-wycmongodb+srv://ben-wycliff:9UwETeTDtrG5zg7K@rctms-qwi1m.mongodb.net/rmcts?retryWrites=true&w=majorityliff:9UwETeTDtrG5zg7K@rctms-qwi1m.mongodb.net/rmcts?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
    }).catch(err => {
        console.log(err)
    })
