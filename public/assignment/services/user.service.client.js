(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService() {
        var users = [
            { "_id": 123, "username": "alice",    "password": "alice",    "firstName": "Alice",
                "lastName": "Wonder",     "email": "alice@gmail.com" },
            { "_id": 234, "username": "bob",      "password": "bob",      "firstName": "Bob",
                "lastName": "Marley",     "email": "bob@gmail.com" },
            { "_id": 345, "username": "charly",   "password": "charly",   "firstName": "Charly",
                "lastName": "Garcia",     "email": "charly@gmail.com" },
            { "_id": 456, "username": "jannunzi", "password": "jannunzi", "firstName": "Jose",
                "lastName": "Annunziato", "email": "jannunzi@gmail.com" }
        ];

        var api = {
            createUser : createUser,
            findUserById : findUserById,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser
        };

        return api;

        function createUser(user) {
            var lastId = parseInt(users[users.length - 1]._id);
            var id = lastId + 1;

            var newUser = { "_id": id, "username": user.username, "password": user.password,
                            "firstName": user.username, "lastName": user.username,
                            "email": user.username + "@gmail.com"};

            users.push(newUser);
            return id;
        }

        function findUserById(userId) {
            for (var u in users) {
                user = users[u];
                if (user._id === userId) {
                    return user;
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for (var u in users) {
                user = users[u];
                if (user.username === username) {
                    return user;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for (var u in users) {
                user = users[u];
                if (user.username === username &&
                    user.password === password) {
                    return user;
                }
            }
            return null;
        }

        function updateUser(userId, user) {
            for (var u in users) {
                currUser = users[u];
                if (currUser._id === userId) {
                    users[u] = user;
                }
            }
        }

        function deleteUser(userId) {
            for (var u in users) {
                currUser = users[u];
                if (currUser._id === userId) {
                    delete users[u];
                }
            }

        }
    }
})();