angular.module('starter.controllers', [])

  .controller('RegisterCtrl', function($scope, $state,UserRegistration, $ionicPopup, $rootScope, SERVER){
    $scope.data = {};

    $scope.register = function(user){
      var user_session = new UserRegistration({user: user});
      console.log(user_session);
      user_session.$save(
        function(data) {
          window.localStorage['username'] = data.username;
          window.localStorage['auth_token'] = data.auth_token;
          $state.go('tab.map');
        },
      function(err) {
        var error = err["data"]["errors"]["detail"];
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occurred',
          template: error
        });
      }
      );
    };
  })

  .controller('SignInCtrl', function($scope, $state, UserService) {
    $scope.signIn = function (user) {
      UserService.login({user: user});
    };
  })
  //.controller('SignOutCtrl', function($scope, $state, UserService) {
  //  $scope.signOut = function (){
  //    console.log("signing out");
  //    UserService.logout();
  //  };
  //})

  .controller('MapCtrl', function($scope, $state, $ionicLoading, GoogleMaps, $cordovaGeolocation , LocationService, $compile) { //, $cordovaGeolocation, $ionicLoading, LocationService, $rootScope) {

    ionic.Platform.ready(function () {
      //GoogleMaps.init($scope);

      var infoWindow = new google.maps.InfoWindow();

        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var options = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: true,
            zoomControl: true,
            scaleControl: true
          };

          map = new google.maps.Map(document.getElementById("map"), mapOptions);

          $ionicLoading.hide();

          //Wait until the map is loaded
          google.maps.event.addListenerOnce(map, 'idle', function(){
            var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });
          });

          google.maps.event.addListener(map, 'idle', function(){
            //Load the markers
            loadMarkers(map.getBounds().getCenter(), map);

          });

        }, function(error){
          console.log("Could not get location");
          console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        });


      function loadMarkers(latLng, map, scope){
        var places = LocationService.nearbySearch(latLng,map)
          .then(function(results) {
            console.log("loading markers");
            var apiPlaces = LocationService.getLocations(results).then(function(results){
              if (results.success == "true")
                return results.locations;
            }).catch(function(error){
              console.log('error' + error);
            });
            return apiPlaces;
          }).then(function(results){
            console.log("should be api results");
            console.log(results);
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              addMarker(place, map);
            }
          }).catch(function(error){
            console.log('error' + error);
          });

      }

      function addMarker(place, map) {
        var marker = new google.maps.Marker({
          map: map,
          name: place.name,
          position: place.location,
          icon: {
            url: 'img/gasstation-512.png', // http://maps.gstatic.com/mapfiles/circle.png',
            scaledSize: new google.maps.Size(35, 37)
          }
        });

        var popupContent = $compile(
          '<div class="locationContent" id="locationContent">' +
          '<div class="locationName" name="locationName" ng-model="location.name">' + place.name + '</div>' +
          '<div class="locationPlaceId" name="locationPlaceId" ng-model="location.placeId">'+ place.place_id + '</div>' +
          '<div class="locationId" name="locationId" ng-model="location.id">' + place.id + '</div>' +
          '<div class="ratingLabel">Cleanliness</div>' +
          '<div class="rating">' +
          '<rating ng-model="rating.rate" max="rating.max" ></rating>' +
          '</div>' +
          '<input class="button button-block button-dark" id="rateButton" type="button" ng-click="rate(rating.rate,location);" value="Rate!">' +
          '</div>')($scope);

        //var popupContent = $compile('<div locationDirective>{{stuff}}</div>')($scope);

        var place_info = {};
        place_info.name = place.name;
        place_info.placeId = place.place_id;
        place_info.id = place.id;

        console.log(place_info);

        google.maps.event.addListener(marker, 'click', function () {
          //$scope.rating = {rate: place.rating};
          $scope.rating.rate = 3;

          infoWindow.setContent(popupContent[0]);
          infoWindow.open(map, this);
          $scope.location = place;
        });

      }
      $scope.rating = {rate: 3};

      $scope.rating.rate = 3;
      $scope.rating.max = 5;

      $scope.rate = function(rating, location){
        LocationService.rate(rating, location.id);
      };

      $scope.$watch('rating.rate', function() {
        console.log('New value: ' + $scope.rating.rate);
      });
    });


})

  .controller('FavoritesCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.rating = {};
    $scope.rating.rate = 3;
    $scope.rating.max = 5;

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
