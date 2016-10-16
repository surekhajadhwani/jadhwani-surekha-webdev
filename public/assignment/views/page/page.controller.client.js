(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($scope) {
        var vm = this;
    }

    function NewPageController($scope) {
        var vm = this;
    }

    function EditPageController($scope) {
        var vm = this;
    }

})();