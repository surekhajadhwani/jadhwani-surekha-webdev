module.exports = function () {
    var models = {}
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        setModels: setModels,
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function createWidget(pageId, widget) {
        widget._page = pageId;
        return new Promise(function (success, err) {
            WidgetModel
                .create(widget)
                .then(function (newWidget) {
                    models.pageModel
                        .findPageById(pageId)
                        .then(function (page) {
                            newWidget._page = page._id;
                            newWidget.save();
                            page.widgets.push(newWidget);
                            page.save();
                            success(newWidget);
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

    function findAllWidgetsForPage(pageId) {
        return models.pageModel.findAllWidgetsForPage(pageId);
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        return WidgetModel.update(
            {
                _id: widgetId
            },
            {
                $set: widget
            }
        );
    }

    function deleteWidget(widgetId) {
        return WidgetModel.remove({
            _id: widgetId
        });
    }

    function reorderWidget(pageId, start, end) {
        return models.pageModel
                .findPageById(pageId)
                .then(
                    function(page){
                        var widget = page.widgets.splice(start,1)[0];
                        page.save();
                        page.widgets.splice(end, 0, widget);
                        return page.save();
                    },
                    function(err){
                        console.log(err);
                    });
    }
};