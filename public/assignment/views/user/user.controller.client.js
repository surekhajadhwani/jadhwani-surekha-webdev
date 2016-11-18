(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            if (!(username && password)) {
                vm.error = "Please enter username and password.";
                return;
            }

            UserService
                .findUserByCredentials(username, password)
                .success(function (user) {
                    if(user === '0') {
                        vm.error = "No such user";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (err) {
                    console.log("Error logging in!");
                    console.log(err);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if (!(user && user.username && user.password)) {
                vm.error = "Invalid Username/Password!";
            } else {
                if (user.password === user.verifyPassword) {
                    UserService
                        .createUser(user)
                        .success(function (user) {
                            $location.url("/user/" + user._id);
                        })
                        .error(function (err) {
                            console.log("Error creating user");
                            console.log(err);
                        })

                } else {
                    vm.error = "Passwords do not match!"
                }
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        var userId = $routeParams['uid'];

        function init() {
            var user =
            UserService
                .findUserById(userId)
                .success(function (user) {
                    if(user !== '0') {
                        vm.user = user;
                    }
                })
                .error(function (err) {
                    console.log("Error finding the user!");
                    console.log(err);
                });
        }
        init();

        function updateUser(user) {
            if (user.username) {
                UserService.updateUser(userId, user);
            } else {
                vm.error = "Username cannot be empty!";
            }
        }

        function deleteUser(){
            UserService
                .deleteUser(userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function (err) {
                    console.log("Error deleting user");
                    console.log(err);
                });
        }
    }
})();