module.exports = function(app, models) {

    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var page = req.body;
        var websiteId = req.params.websiteId;
        models
            .pageModel
            .createPage(websiteId, page)
            .then(
                function (newPage) {
                    res.send(newPage);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        models
            .pageModel
            .findAllPagesForWebsite(websiteId)
            .then(
                function (website) {
                    res.send(website.pages);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        models
            .pageModel
            .findPageById(pageId)
            .then(
                function (page) {
                    res.send(page);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function updatePage(req, res) {
        var page = req.body;
        var pageId = req.params.pageId;
        models
            .pageModel
            .updatePage(pageId, page)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;

        models
            .pageModel
            .deletePage(pageId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }
};