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
            if (user === undefined || user.username === undefined || user.password === undefined) {
                vm.error = "Invalid Username/Password!";
            } else {
                if (user.password === user.verifyPassword) {
                    var userId = UserService.createUser(user);
                    var user = UserService.findUserById(userId);
                    $location.url("/user/" + user._id);
                } else {
                    vm.error = "Passwords do not match!"
                }
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var user = UserService.findUserById(userId);
        if(user != null) {
            vm.user = user;
        }
    }
})();