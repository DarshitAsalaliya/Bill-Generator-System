var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
const fs = require('fs')

var app = express();
var router = express.Router();

// Configure Image 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/categoryimages');
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

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
                        res.render('../views/admin/manage-category', { categoryList: data, categoryUpdateData: singleCategoryData });
                    }
                });
            }
        }
    });
})

// add or update category
router.post('/', upload.single('file'), function (req, res) {

    var newCategory = new CategoryModel();

    newCategory.CategoryName = req.body.CategoryName;
    newCategory.CategoryStatus = req.body.CategoryStatus == "on" ? true : false;

    if (!req.body.id) {
        newCategory.FileName = req.file.filename;
    }
    else {
        newCategory._id = req.body.id;
        
        if (req.file) {
            CategoryModel.findById(req.body.id, function (err, singleCategoryData) {
                if (err)
                    console.log(err);
                else {
                    if (fs.existsSync(path.join('./public/images/categoryimages/', singleCategoryData.FileName))) {
                        console.log(req.file);
                        fs.unlinkSync(path.join('./public/images/categoryimages/', singleCategoryData.FileName));
                        newCategory.FileName = req.file.filename;
                    }
                }
            });
        }
        else
        {
            CategoryModel.findById(req.body.id, function (err, singleCategoryData) {
                if (err)
                    console.log(err);
                else {
                    newCategory.FileName = singleCategoryData.FileName;
                }
            });
        }
    }

    if (req.body.operation == "update") {
        console.log(newCategory);
        CategoryModel.findByIdAndUpdate(req.body.id, newCategory, function (err, data) {
            if (err)
                console.log(err);
            else
                res.redirect('/admin/category');
        });
    }
    else {
        newCategory.save(function (err, data) {
            if (err)
                console.log(err);
            else
                res.redirect('/admin/category');
        });
    }
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