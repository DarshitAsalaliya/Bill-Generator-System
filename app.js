var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

require('dotenv').config()

var app = express();

// set body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set session

app.use(session({
    secret: 'AHJVFJGJ521HG84HJVGDHBBKJBE',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge:900000 }
}))

// set the view engine to ejs
app.set('view engine', 'ejs');

// admin route
const dashboardController = require('./controllers/dashboardController.js');
const categoryController = require('./controllers/categoryController.js');
const productController = require('./controllers/productController.js');
const billController = require('./controllers/billController.js');
const loginController = require('./controllers/loginController.js');

// set public folder for admin
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin/category', express.static(path.join(__dirname, 'public')));
app.use('/admin/product', express.static(path.join(__dirname, 'public')));
app.use('/admin/bill', express.static(path.join(__dirname, 'public')));

app.use("/", loginController);
app.use("/admin", dashboardController);
app.use("/admin/category", categoryController);
app.use("/admin/product", productController);
app.use("/admin/bill", billController);

// port number
app.listen(process.env.PORT);