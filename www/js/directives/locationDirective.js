//angular.module('app.directives')
//  .directive('locationDirective', [function(){
//    return {
//      restrict: "AEC",
//      replace: true,
//      transclude: true,
//      template:
//        '<div class="locationContent" id="locationContent">' +
//        '<div class="locationName" name="locationName" ng-model="place.name">' + place.name + '</div>' +
//        '<div class="locationPlaceId" name="locationPlaceId" ng-model="place.placeId">'+ place.place_id + '</div>' +
//        '<div class="locationId" name="locationId" ng-model="place.id">' + place.id + '</div>' +
//        '<div class="ratingLabel">Cleanliness</div>' +
//        '<div class="rating">' +
//        '<rating ng-model="rating.rate" max="rating.max" ></rating>' +
//        '</div>' +
//        '<input class="button button-block button-dark" id="rateButton" type="button" ng-click="rate(rating, place);" value="Rate!">' +
//        '</div>',
//      scope: {},
//      controller: function($scope, $element){
//
//      };
//    }
//  }]);
