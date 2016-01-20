angular.module('starter.controllers', [])

  .controller('SignInCtrl', function($scope, $state, UserSession, $ionicPopup, $rootScope) {
    $scope.data = {};

    $scope.signIn = function(user) {
        var user_session = new UserSession({user: user});
        user_session.$save(
          function (data) {
            window.localStorage['username'] = data.username;
            window.localStorage['auth_token'] = data.auth_token;

            $state.go('tab.map');
          },
          function (err) {
            var error = err["data"]["errors"]["detail"];
            var confirmPopup = $ionicPopup.alert({
              title: 'An error occurred',
              template: error
            });
          }
        );
    };
  })

  .controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading, PeeLocations) {
  ionic.Platform.ready(function () {
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });
    var options = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};
    //alert($cordovaGeolocation);

    ionic.Platform.ready(function () {
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $ionicLoading.hide();

        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
          var places = PeeLocations.nearbySearch(latLng,$scope.map).then(function(results) {
            console.log('success' + results);
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              addMarker(place);
            }

            function addMarker(place) {
              var icon = 'img/gasstation-512.png';
              var marker = new google.maps.Marker({
                map: $scope.map,
                name: place.name,
                position: place.geometry.location,
                icon: {
                  url: 'img/gasstation-512.png', // http://maps.gstatic.com/mapfiles/circle.png',
                  scaledSize: new google.maps.Size(35, 37)
                }
              });

              var popupContent = '<div class="locationContent">' +
                '<div class="locationName">' + place.name + '</div>' +
                '<div class="locationPlaceId">'+ place.id + '</div>' +
                '<div class="locationGeometryLocation">'+ place.geometry.location + '</div>' +
                //'<div class="radio-stars">' +
                //  '<input class="sr-only" id="radio-5" name="radio-star" type="radio" value="5" />' +
                //  '<label class="radio-star" for="radio-5">5</label>' +
                //  '<input checked="" class="sr-only" id="radio-4" name="radio-star" type="radio" value="4" />' +
                //  '<label class="radio-star" for="radio-4">4</label>' +
                //  '<input class="sr-only" id="radio-3" name="radio-star" type="radio" value="3" />' +
                //  '<label class="radio-star" for="radio-3">3</label>' +
                //  '<input class="sr-only" id="radio-2" name="radio-star" type="radio" value="2" />' +
                //  '<label class="radio-star" for="radio-2">2</label>' +
                //  '<input class="sr-only" id="radio-1" name="radio-star" type="radio" value="1" />' +
                //  '<label class="radio-star" for="radio-1">1</label>' +
                //  '<span class="radio-star-total"></span>' + '</div>' +
                '</div>';

              var infoWindow = new google.maps.InfoWindow({
                content: popupContent
              });

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
              });
            }
          },function(error){
            console.log('error' + error);
          });


          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
          });

        });
      }, function (error) {
        console.log("Could not get location");
        console.log('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      });
    });
  })
})

  .controller('FavoritesCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
