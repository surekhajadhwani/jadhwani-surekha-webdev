module.exports = function(app, models) {

    var mime = require('mime');  // npm install mime --save
    var multer = require('multer'); // npm install multer --save

    // Saving image with extension
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/assignment/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({ storage: storage });

    app.post ('/api/upload', upload.single('myFile'), uploadImage);
    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.put('/api/page/:pageId/widget', sortWidgets);

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        if (!myFile) {
            res.redirect("/assignment/#/user/" + userId +
                         "/website/" + websiteId +
                         "/page/" + pageId +
                         "/widget/" + widgetId);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                widgets[w].name = originalname;
                widgets[w].width = width;
                widgets[w].url = "/assignment/uploads/" + filename;
                res.redirect("/assignment/#/user/" + userId +
                             "/website/" + websiteId +
                             "/page/" + pageId +
                             "/widget/" + widgetId);
                return;
            }
        }
        res.redirect("");
    }

    function createWidget(req, res) {
        var widget = req.body;
        var pageId = req.params.pageId;
        models
            .widgetModel
            .createWidget(pageId, widget)
            .then(
                function (newWidget) {
                    res.send(newWidget);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        models
            .widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function (page) {
                    res.send(page.widgets);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgteId = req.params.widgetId;
        models
            .widgetModel
            .findWidgetById(widgteId)
            .then(
                function (widget) {
                    res.send(widget);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = req.params.widgetId;
        models
            .widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        models
            .widgetModel
            .deleteWidget(widgetId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function sortWidgets(req, res) {
    /*    var pageId = parseInt(req.params.pageId);
        var initial = parseInt(req.query.initial);
        var final = parseInt(req.query.final);

        var startIndex = 0;
        var endIndex = 0;
        var num = 0;
        for (var w in widgets) {
            if (widgets[w].pageId === pageId) {
                if (num === initial) {
                    startIndex = parseInt(w);
                }
                if (num === final) {
                    endIndex = parseInt(w);
                }
                num++;
            }
        }
        widgets.splice(endIndex, 0, widgets.splice(startIndex, 1)[0]);

        res.sendStatus(200);*/
    }
};