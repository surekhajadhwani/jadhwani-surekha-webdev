module.exports = function(app, models) {

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res) {
        var website = req.body;
        var userId = req.params.userId;
        models
            .websiteModel
            .createWebsiteForUser(userId, website)
            .then(
                function (newWebsite) {
                    res.send(newWebsite);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        models
            .websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function (websites) {
                    res.send(websites);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        models
            .websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    res.send(website);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function updateWebsite(req, res) {
        var website = req.body;
        var websiteId = req.params.websiteId;

        models
            .websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        models
            .websiteModel
            .deleteWebsite(websiteId)
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