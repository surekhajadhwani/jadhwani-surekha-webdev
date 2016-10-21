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

            user._id = id;
            user.firstName = user.username;
            user.lastName = user.username;
            user.email = user.username + "@gmail.com";

            users.push(user);
            return id;
        }

        function findUserById(userId) {
            for (var u in users) {
                if (users[u]._id === userId) {
                    return JSON.parse(JSON.stringify(users[u]));
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for (var u in users) {
                if (users[u].username === username) {
                    return JSON.parse(JSON.stringify(users[u]));
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for (var u in users) {
                if (users[u].username === username &&
                    users[u].password === password) {
                    return JSON.parse(JSON.stringify(users[u]));
                }
            }
            return null;
        }

        function updateUser(userId, user) {
            for (var u in users) {
                if (users[u]._id === userId) {
                    users[u] = user;
                    break;
                }
            }
        }

        function deleteUser(userId) {
            for (var u in users) {
                if (users[u]._id === userId) {
                    users.splice(parseInt(u), 1);
                    break;
                }
            }
        }
    }
})();