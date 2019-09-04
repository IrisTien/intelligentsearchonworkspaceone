appCenter.component('appRating', {
    templateUrl: 'app-v2/components/appRating/appRating.html',
    bindings: {
        ratingData: '=',
        hideVirtualApp: '=?',
        app: '=?'
    },
    controller: ['$http', 'RequestFactory', function($http, RequestFactory) {
        var ctrl = this;

        var ratingMap = {
            like: 1,
            dislike: -1,
            neutral: 0
        };

        ctrl.updateLikeRating = function() {
            var oldRating = {};
            angular.copy(ctrl.ratingData, oldRating);
            if (ctrl.ratingData.rating === ratingMap.dislike) {
                --ctrl.ratingData.dislikes;
            }
            if (ctrl.ratingData.rating !== ratingMap.like) {
                ++ctrl.ratingData.likes;
                ctrl.ratingData.rating = ratingMap.like;
            } else {
                --ctrl.ratingData.likes;
                ctrl.ratingData.rating = ratingMap.neutral;
            }
            updateAppRating(ctrl.ratingData, oldRating);
        };

        ctrl.updateDislikeRating = function() {
            var oldRating = {};
            angular.copy(ctrl.ratingData, oldRating);
            if (ctrl.ratingData.rating === ratingMap.like) {
                --ctrl.ratingData.likes;
            }
            if (ctrl.ratingData.rating !== ratingMap.dislike) {
                ++ctrl.ratingData.dislikes;
                ctrl.ratingData.rating = ratingMap.dislike;
            } else {
                --ctrl.ratingData.dislikes;
                ctrl.ratingData.rating = ratingMap.neutral;
            }
            updateAppRating(ctrl.ratingData, oldRating);
        };

        function updateAppRating(ratingData, oldRating) {
            if (ratingData.url) {
                var url = ratingData.url + "/" + ratingData.rating;
                var req = RequestFactory(url, { method: 'PUT' });
                $http(req).catch(function() {
                    ctrl.ratingData = oldRating;
                });
            }
        }
    }],
    controllerAs: 'appRatingCtrl'
});
