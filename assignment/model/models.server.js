module.exports = function() {

    var connectionString = 'mongodb://heroku_0v1rk2bt:l3t32hhnf85788sr9k54rmuu89@ds033116.mlab.com:33116/heroku_0v1rk2bt';

    var mongoose = require("mongoose");
    mongoose.connect(connectionString);
    // mongoose.connect("mongodb://localhost/cs5610-assignment");

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();

    var models = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };

    userModel.setModels(models);
    websiteModel.setModels(models);
    pageModel.setModels(models);
    widgetModel.setModels(models);

    return models;
};