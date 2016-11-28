module.exports = function () {
    var models = {}
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        setModels: setModels,
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        findAllWidgetsForPage: findAllWidgetsForPage,
        updatePage: updatePage,
        deletePage: deletePage,
        deletePagesFromWebsite: deletePagesFromWebsite,
        deleteWidgetReference: deleteWidgetReference
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function createPage(websiteId, page) {
        page._website = websiteId;
        return new Promise(function (success, err) {
            PageModel
                .create(page)
                .then(function (newPage) {
                    models.websiteModel
                        .findWebsiteById(websiteId)
                        .then(function (website) {
                            newPage._website = website._id;
                            newPage.save();
                            website.pages.push(newPage);
                            website.save();
                            success(newPage);
                        }, function (error) {
                            err(error);
                        });
                },
                    function (error) {
                        err(error);
                    }
                );
        });
    }

    function findAllPagesForWebsite(websiteId) {
        return models.websiteModel.findAllPagesForWebsite(websiteId);
    }

    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }
    
    function findAllWidgetsForPage(pageId) {
        return PageModel
                   .findById(pageId)
                   .populate("widgets")
                   .exec();
    }

    function updatePage(pageId, page) {
        return PageModel.update(
            {
                _id: pageId
            },
            {
                $set: page
            }
        );
    }

    function deletePage(pageId) {
        return new Promise(function (success, err) {
            PageModel
                .findById(pageId)
                .then(function (page) {
                        var websiteId = page._website;
                        PageModel
                            .remove({ _id: pageId })
                            .then(function (status) {
                                models
                                    .websiteModel
                                    .deletePageReference(websiteId, pageId)
                                    .then(function (website) {
                                        models
                                            .widgetModel
                                            .deleteWidgetsFromPage(pageId)
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

    function deletePagesFromWebsite(websiteId) {
        return new Promise(function (success, err) {
            PageModel
                .find({ _website: websiteId })
                .then(function (pages) {
                    for (var i = 0; i < pages.length; i++) {
                        var pageId = pages[i]._id;
                        PageModel
                            .remove({ _id: pageId })
                            .exec()
                            .then(function (status) {
                                success(200);
                            }, function (error) {
                                console.log(error);
                            });
                        models
                            .widgetModel
                            .deleteWidgetsFromPage(pageId)
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

    function deleteWidgetReference(pageId, widgetId) {
        return PageModel.update(
            {
                _id: pageId
            },
            {
                $pull: {widgets: widgetId}
            });
    }

};