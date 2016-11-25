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
        findWebsitesForUser: findWebsitesForUser,
        updateUser: updateUser,
        deleteUser: deleteUser
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
        return UserModel.remove({
            _id: userId
        });
    }
};