module.exports = function () {
    var models = {}
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        setModels: setModels,
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId,
        findWebsitesForUser: findWebsitesForUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        deleteWebsiteReference: deleteWebsiteReference
    };
    return api;

    function setModels(_models) {
        models = _models;
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({
            username: username
        });
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findWebsitesForUser(userId) {
        return UserModel
                   .findById(userId)
                   .populate("websites", "name")
                   .exec();
    }

    function updateUser(userId, user) {
        return UserModel.update(
            {
                _id: userId
            },
            {
                $set: user
            }
        );
    }

    function deleteUser(userId) {
        return new Promise(function (success, err) {
            UserModel
                .findById(userId)
                .then(function (user) {
                        UserModel
                            .remove({ _id: userId })
                            .then(function (status) {
                                models
                                    .websiteModel
                                    .deleteWebsitesFromUser(userId)
                                    .then(function (status) {
                                        success(200);
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

    function deleteWebsiteReference(userId, websiteId) {
        return UserModel.update(
            {
                _id: userId
            },
            {
                $pull: {websites: websiteId}
            });
    }
};