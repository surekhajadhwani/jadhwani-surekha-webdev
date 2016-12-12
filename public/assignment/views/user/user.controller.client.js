(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (!(user && user.username && user.password)) {
                vm.error = "There were errors in the form, please fix them";
                return;
            }
            if (user.username == "" || user.password == "") {
                vm.error = "There were errors in the form, please fix them";
                return;
            }

            UserService
                .login(user)
                .success(function (user) {
                    if(user === '0') {
                        vm.error = "No such user";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (err) {
                    if (err === "Unauthorized") {
                        vm.error = "No such user";
                    }
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
                vm.error = "There were errors in the form, please fix them";
                return;
            } else if (user.username == "" || user.password == "") {
                vm.error = "There were errors in the form, please fix them";
                return;
            } else {
                if (user.password === user.verifyPassword) {
                    UserService
                        .register(user)
                        .success(function (user) {
                            $location.url("/user/" + user._id);
                        })
                        .error(function (err) {
                            console.log("Error creating user");
                            console.log(err);
                        })

                } else {
                    vm.isMatch = false;
                    vm.error = "There were errors in the form, please fix them"
                }
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            var user =
            UserService
                .findLoggedInUser()
                .success(function (user) {
                    if(user !== '0') {
                        vm.user = user;
                        vm.userId = user._id;
                    }
                })
                .error(function (err) {
                    console.log("Error finding the user!");
                    console.log(err);
                });
        }
        init();

        function updateUser(user) {
            if (user.username && user.username != "") {
                UserService.updateUser(vm.userId, user);
            } else {
                vm.error = "There were errors in the form, please fix them";
            }
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function (err) {
                    console.log("Error deleting user");
                    console.log(err);
                });
        }
        
        function logout() {
            UserService
                .logout()
                .success(function () {
                   $location.url("/login");
                })
                .error(function (err) {
                    console.log("Error logging out user");
                    console.log(err);
                });
        }
    }
})();