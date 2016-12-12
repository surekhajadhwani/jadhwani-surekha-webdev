(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.userId  = $routeParams['uid'];
        vm.websiteId  = $routeParams['wid'];
        vm.pageId  = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;

        function init() {
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function (err) {
                    console.log("Error retrieving widgets");
                    console.log(err);
                });
        }
        init();

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYouTubeUrl(url) {
            if(url && url != "") {
                var parts = url.split('/');
                var id = parts[parts.length - 1];
                url = "https://www.youtube.com/embed/"+id;
                console.log(url);
                return $sce.trustAsResourceUrl(url);
            }
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.addWidget = addWidget;

        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function addWidget(type){
            WidgetService
                .createWidget(vm.pageId, {"type" : type})
                .success(function (widget) {
                    vm.widgetId = widget._id;
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId);
                })
                .error(function (err) {
                    console.log("Error creating widget");
                    console.log(err);
                });
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId  = $routeParams['uid'];
        vm.websiteId  = $routeParams['wid'];
        vm.pageId  = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        
        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                })
                .error(function (err) {
                    console.log("Error retrieving widget");
                    console.log(err);
                });
        }
        init();
        
        function updateWidget(widget) {
            if(widget.name) {
                WidgetService
                    .updateWidget(vm.widgetId, widget)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
                    .error(function (err) {
                        console.log("Error updating widget");
                        console.log(err);
                    });
            } else {
                vm.error = "Widget Name is required"
            }

        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function (err) {
                    console.log("Error deleting widget");
                    console.log(err);
                });
        }
    }
})();