(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;

        vm.userId = parseInt($routeParams['uid']);

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function (err) {
                    console.log("Error fetching websites");
                    console.log(err);
                })
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.addWebsite = addWebsite;

        vm.userId = parseInt($routeParams['uid']);

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function (err) {
                    console.log("Error fetching websites");
                    console.log(err);
                })
        }
        init();

        function addWebsite(website){
            if (website.name) {
                WebsiteService
                    .createWebsite(vm.userId, website)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function (err) {
                        console.log("Error creating website");
                        console.log(err);
                    });
            } else {
                vm.error = "Website name cannot be empty!";
            }
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        vm.websiteId = parseInt($routeParams['wid']);
        vm.userId = parseInt($routeParams['uid']);

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function (website) {
                    vm.website = website;
                })
                .error(function (err) {
                    console.log("Error fetching website with id: " + vm.websiteId);
                    console.log(err);
                })
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function (err) {
                    console.log("Error fetching websites");
                    console.log(err);
                })
        }
        init();

        function deleteWebsite(){
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function (err) {
                    console.log("Error deleting website");
                    console.log(err)
                })
        }

        function updateWebsite(website) {
            if (website.name) {
                WebsiteService
                    .updateWebsite(vm.websiteId, website)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function (err) {
                        console.log("Error updating website");
                        console.log(err);
                    })

            } else {
                vm.error = "Website name cannot be empty!";
            }
        }
    }
})();