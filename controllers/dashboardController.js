var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');

const fs = require('fs')

var app = express();
var router = express.Router();

// import connection
var connection = require("../db/connection");

// import model
var CategoryModel = require('../models/categoryModel');

// get category list
router.get('/', function (req, res) {
   
    res.render('../views/admin/index', {
        totalCategory: 100,
        totalProduct: 200
    });
})

module.exports = router