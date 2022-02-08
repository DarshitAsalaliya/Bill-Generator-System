var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
require('dotenv').config()

var app = express();


// set body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// admin route
const dashboardController = require('./controllers/dashboardController.js');
const categoryController = require('./controllers/categoryController.js');
const productController = require('./controllers/productController.js');

// set public folder for admin
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin/category', express.static(path.join(__dirname, 'public')));
app.use('/admin/product', express.static(path.join(__dirname, 'public')));

app.use("/", dashboardController);
app.use("/admin/category", categoryController);
app.use("/admin/product", productController);

// port number
app.listen(process.env.PORT);