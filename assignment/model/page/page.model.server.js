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
        deletePage: deletePage
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
        return PageModel.remove({
            _id: pageId
        });
    }
};