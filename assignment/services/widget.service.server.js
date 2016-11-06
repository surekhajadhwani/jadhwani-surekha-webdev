module.exports = function(app) {

    var mime = require('mime');  // npm install mime --save
    var multer = require('multer'); // npm install multer --save

    // var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });
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

    var widgets = [
        { "_id": 123, "widgetType": "HEADER", "pageId": 321, "size": 2, "text": "GIZMODO"},
        { "_id": 234, "widgetType": "HEADER", "pageId": 321, "size": 4, "text": "Lorem ipsum"},
        { "_id": 345, "widgetType": "IMAGE", "pageId": 321, "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": 456, "widgetType": "HTML", "pageId": 321, "text": "<p>Lorem ipsum</p>"},
        { "_id": 567, "widgetType": "HEADER", "pageId": 321, "size": 4, "text": "Lorem ipsum"},
        { "_id": 678, "widgetType": "YOUTUBE", "pageId": 321, "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": 789, "widgetType": "HTML", "pageId": 321, "text": "<p>Lorem ipsum</p>"}
    ];

    app.post ('/api/upload', upload.single('myFile'), uploadImage);
    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

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
        var pageId = parseInt(req.params.pageId);
        widget._id = (new Date()).getTime();
        widget.pageId = pageId;
        widgets.push(widget);
        res.send(widget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = parseInt(req.params.pageId);
        var results = [];
        for (var w in widgets) {
            if (widgets[w].pageId === pageId) {
                results.push(widgets[w]);
            }
        }
        res.json(results);
    }

    function findWidgetById(req, res) {
        var widgteId = parseInt(req.params.widgetId);
        for (var w in widgets) {
            if (widgets[w]._id === widgteId) {
                res.send(widgets[w]);
                return;
            }
        }
        res.send('0');
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = parseInt(req.params.widgetId);
        for (var w in widgets) {
            if (widgets[w]._id === widgetId) {
                widgets[w] = widget;
                res.sendStatus(200);
                return;
            }
        }
        res.send('0');
    }

    function deleteWidget(req, res) {
        var widgetId = parseInt(req.params.widgetId);
        for(var w in widgets) {
            if(widgets[w]._id === widgetId) {
                widgets.splice(parseInt(w), 1);
                res.sendStatus(200);
                return;
            }
        }
        res.send('0');
    }
};