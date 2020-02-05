const express = require('express');
const bodyParser = require('body-parser');

const catalogRoutes = require('./routes/catalog');
const consumerRoutes = require('./routes/consumer');
const adminRoutes = require('./routes/admin');
const connectMongo = require('./utils/database');



const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Method','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})


//------------------routes-------------------------------
app.use(catalogRoutes);
app.use(consumerRoutes);
app.use('/admin', adminRoutes);

connectMongo(() => {
    app.listen(3000);
});