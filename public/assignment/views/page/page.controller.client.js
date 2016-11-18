(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function (err) {
                    console.log("Error retrieving pages");
                    console.log(err);
                });
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.addPage = addPage;

        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function (err) {
                    console.log("Error retrieving pages");
                    console.log(err);
                })
        }
        init();

        function addPage(page){
            if (page.name) {
                PageService
                    .createPage(vm.websiteId,page)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function (err) {
                        console.log("Error creating page");
                        console.log(err);
                    })
            } else {
                vm.error = "Page name cannot be empty!";
            }
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function (err) {
                    console.log("Error retrieving pages");
                    console.log(err);
                })
            PageService
                .findPageById(vm.pageId)
                .success(function (page) {
                    vm.page = page;
                })
                .error(function (err) {
                    console.log("Error retrieving page");
                    console.log(err);
                })
        }
        init();

        function deletePage(){
            PageService
                .deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function (err) {
                    console.log("Error deleting page");
                    console.log(err);
                })
        }

        function updatePage(page){
            if (page.name) {
                PageService
                    .updatePage(vm.pageId,page)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function (err) {
                        console.log("Error updating page");
                        console.log(err);
                    })
            } else {
                vm.error = "Page name cannot be empty!";
            }
        }
    }

})();