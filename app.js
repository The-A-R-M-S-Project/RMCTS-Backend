const express = require('express');
const bodyParser = require('body-parser');

const catalogRoutes = require('./routers/catalog');
const consumerRoutes = require('./routers/consumer');
const adminRoutes = require('./routers/owner');



const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(catalogRoutes);
app.use(consumerRoutes);
app.use(adminRoutes);

app.listen(3000);