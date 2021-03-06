module.exports = function () {
    var models = {};
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        setModels: setModels,
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        findAllPagesForWebsite: findAllPagesForWebsite,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        deleteWebsitesFromUser: deleteWebsitesFromUser,
        deletePageReference: deletePageReference
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function createWebsiteForUser(userId, website) {
        website._user = userId;
        return new Promise(function (success, err) {
            WebsiteModel
                .create(website)
                .then(function (newWebsite) {
                    models.userModel
                        .findUserById(userId)
                        .then(function (user) {
                            newWebsite._user = user._id;
                            newWebsite.save();
                            user.websites.push(newWebsite);
                            user.save();
                            success(newWebsite);
                        }, function (error) {
                            err(error);
                        });
                },
                    function (error) {
                        err(error);
                    }
                )
        });
    }

    function findAllWebsitesForUser(userId) {
        return models.userModel.findWebsitesForUser(userId);
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function findAllPagesForWebsite(websiteId) {
        return WebsiteModel
                   .findById(websiteId)
                   .populate("pages", "name")
                   .exec();
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel.update(
            {
                _id: websiteId
            },
            {
                $set: website
            }
        );
    }

    function deleteWebsite(websiteId) {
        return new Promise(function (success, err) {
            WebsiteModel
                .findById(websiteId)
                .then(function (website) {
                        var userId = website._user;
                        WebsiteModel
                            .remove({ _id: websiteId })
                            .then(function (status) {
                                models
                                    .userModel
                                    .deleteWebsiteReference(userId, websiteId)
                                    .then(function (user) {
                                        models
                                            .pageModel
                                            .deletePagesFromWebsite(websiteId)
                                            .then(function (status) {
                                                success(200);
                                            }, function (error) {
                                                err(error);
                                            });
                                    }, function (error) {
                                        err(error);
                                    });
                            }, function (error) {
                                err(error);
                            });
                    },
                    function (error) {
                        err(error);
                    });
        });
    }

    function deleteWebsitesFromUser(userId) {
        return new Promise(function (success, err) {
            WebsiteModel
                .find({ _user: userId })
                .then(function (websites) {
                    for (var i = 0; i < websites.length; i++) {
                        var websiteId = websites[i]._id;
                        WebsiteModel
                            .remove({ _id: websiteId })
                            .then(function (status) {
                                success(200);
                            }, function (error) {
                                err(error);
                            });
                        models
                            .pageModel
                            .deletePagesFromWebsite(websiteId)
                            .then(function (status) {
                                success(200);
                            }, function (error) {
                                err(error);
                            });
                    }
                    success(200);
                }, function (error) {
                    err(error);
                })
        });
    }

    function deletePageReference(websiteId, pageId) {
        return WebsiteModel.update(
            {
                _id: websiteId
            },
            {
                $pull: {pages: pageId}
            });
    }
};