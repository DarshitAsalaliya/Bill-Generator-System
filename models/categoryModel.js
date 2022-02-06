var mongoose = require('mongoose');

var CategoryModel = new mongoose.Schema({
    CategoryName: String,
    CategoryStatus: Boolean
});

module.exports = mongoose.model('Category', CategoryModel, 'Category');