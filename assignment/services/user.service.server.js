module.exports = function (app, models) {

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    function createUser(req, res) {
        var user = req.body;
        models
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.send(newUser);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.send('0');
        }
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        models
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        models
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }
    function findUserById(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function updateUser(req, res) {
        var user = req.body;
        var userId = req.params.userId;
        models
            .userModel
            .updateUser(userId, user)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        models
            .userModel
            .deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }
};