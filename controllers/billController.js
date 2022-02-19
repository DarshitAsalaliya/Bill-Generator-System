var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');

const fs = require('fs');

var app = express();
var router = express.Router();

// Configure Image 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/productimages');
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
var ProductModel = require('../models/productModel');
var CategoryModel = require('../models/categoryModel');
var BillModel = require('../models/billModel');

// get category list
router.get('/', function (req, res) {

    ProductModel.find(function (err, data) {
        if (err)
            console.log(err);
        else {
            ProductModel.find(function (err, data) {
                if (err)
                    console.log(err);
                else {
                    CategoryModel.find({ Status: true }, function (err, categorydata) {
                        res.render('../views/admin/generate-bill', {
                            formDataError: [{
                                context: { label: '' }
                            }], productList: data, categoryList: categorydata
                        });
                    });
                }
            });
        }
    });
})

// add or update
router.post('/print', function (req, res) {

    selectedItemQty = [];
    selectedProductName = [];
    selectedProductPrice = [];
    selectedProductCost = [];
    totalBillPrice = [];

    BillDetails = [];

    for (var i = 0; i < req.body.selectedItemQty.length; i++) {
        if (req.body.selectedItemQty[i] > 0) {
            selectedProductName.push(req.body.selectedProductName[i]);
            selectedProductCost.push(req.body.selectedProductCost[i]);
            selectedProductPrice.push(req.body.selectedProductPrice[i]);
            selectedItemQty.push(req.body.selectedItemQty[i]);
            totalBillPrice.push(req.body.selectedItemQty[i] * req.body.selectedProductPrice[i]);
        }
    }

    BillDetails.push(selectedProductName);
    BillDetails.push(selectedProductPrice);
    BillDetails.push(selectedItemQty);
    BillDetails.push(totalBillPrice);
    BillDetails.push(req.body.billDate);
    BillDetails.push(req.body.buyerName);
    BillDetails.push(selectedProductCost);

    var newBill = new BillModel();

    newBill.Bill = { OrderDate: req.body.billDate, BuyerName: req.body.buyerName, Product: selectedProductName, ProductCost: selectedProductCost, ProductPrice: selectedProductPrice, Qty: selectedItemQty, TotalAmount: totalBillPrice };

    newBill.save(function (err, data) {
        if (err)
            console.log(err);
    });

    res.render('../views/admin/bill-print', {
        formDataError: [{
            context: { label: '' }
        }], orderedProductList: BillDetails
    });
})

// get bill list
router.get('/list', function (req, res) {

    BillModel.find(function (err, data) {
        console.log(data);
        if (err)
            console.log(err);
        else {
            res.render('../views/admin/bill-list', {
                formDataError: [{
                    context: { label: '' }
                }], billList: data
            });
        }
    });
})

module.exports = router