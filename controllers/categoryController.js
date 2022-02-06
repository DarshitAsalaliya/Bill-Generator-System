var express = require('express')
var mongoose = require('mongoose');

var app = express();
var router = express.Router();

// import connection
var connection = require("../db/connection");

// import model
var CategoryModel = require('../models/categoryModel');

// get category list
router.get('/:id?', function (req, res) {
    var id = req.params.id;

    CategoryModel.find(function (err, data) {
        if (err)
            console.log(err);
        else {
            if (!id) {
                res.render('../views/admin/manage-category', { categoryList: data, categoryUpdateData: {} });
            }
            else {
                CategoryModel.findById(id, function (err, singleCategoryData) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(singleCategoryData);
                        res.render('../views/admin/manage-category', { categoryList: data, categoryUpdateData: singleCategoryData });
                    }
                });
            }
        }
    });
})

// add category
router.post('/', function (req, res) {

    var newCategory = new CategoryModel();

    newCategory.CategoryName = req.body.CategoryName;

    newCategory.CategoryStatus = req.body.CategoryStatus == "on" ? true : false;

    newCategory.save(function (err, data) {
        if (err)
            console.log(err);
        else
            res.redirect('/admin/category');
    });
})

// delete category
router.get('/delete/:id', function (req, res) {

    CategoryModel.findByIdAndRemove(req.params.id, function (err, data) {
        if (err)
            console.log(err);
        else
            res.redirect('/admin/category');
    });
})


module.exports = router