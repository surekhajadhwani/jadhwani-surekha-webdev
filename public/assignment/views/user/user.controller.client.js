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

            var user = UserService.findUserByCredentials(username, password);

            if(user === null) {
                vm.error = "No such user";
            } else {
                $location.url("/user/" + user._id);
            }
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
                    var userId = UserService.createUser(user);
                    $location.url("/user/" + userId);
                } else {
                    vm.error = "Passwords do not match!"
                }
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;

        var userId = parseInt($routeParams['uid']);
        var user = UserService.findUserById(userId);
        if(user != null) {
            vm.user = user;
        }

        function updateUser(user) {
            UserService.updateUser(user);
        }
    }
})();