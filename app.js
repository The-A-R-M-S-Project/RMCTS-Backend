const express = require('express');
const bodyParser = require('body-parser');

const catalogRoutes = require('./routes/catalog');
const consumerRoutes = require('./routes/consumer');
const adminRoutes = require('./routes/admin');



const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(catalogRoutes);
app.use(consumerRoutes);
app.use(adminRoutes);

app.listen(3000);