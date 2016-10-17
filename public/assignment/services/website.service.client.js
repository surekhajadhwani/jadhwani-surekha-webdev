(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {
        var websites = [
            { "_id": 123, "name": "Facebook",    "developerId": 456 },
            { "_id": 234, "name": "Tweeter",     "developerId": 456 },
            { "_id": 456, "name": "Gizmodo",     "developerId": 456 },
            { "_id": 567, "name": "Tic Tac Toe", "developerId": 123 },
            { "_id": 678, "name": "Checkers",    "developerId": 123 },
            { "_id": 789, "name": "Chess",       "developerId": 234 }
        ];

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };

        return api;

        function createWebsite(userId, website) {
            var lastWebsiteId = parseInt(websites[websites.length - 1]._id);
            var websiteId = lastWebsiteId + 1;

            website._id = websiteId;
            website.developerId = userId;
            websites.push(website);
        }

        function findWebsitesByUser(userId) {
            var results = [];
            for (var w in websites) {
                if (websites[w].developerId === userId) {
                    results.push(websites[w]);
                }
            }
            return results;
        }

        function findWebsiteById(websiteId) {
            for (var w in websites) {
                if (websites[w]._id === websiteId) {
                    return websites[w];
                }
            }
            return null;
        }

        function updateWebsite(websiteId, website) {
            for (var w in websites) {
                if (websites[w]._id === websiteId) {
                    websiteId[w] = website;
                }
            }
        }

        function deleteWebsite(websiteId) {
            for (var w in websites) {
                if (websites[w]._id === websiteId) {
                    websites.splice(parseInt(w), 1);
                }
            }
        }
    }
})();