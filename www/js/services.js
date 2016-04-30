angular.module('starter.services', [])

.factory('UserService', function($http,SERVER,$window,$state, $ionicPopup, $timeout,$ionicLoading, $ionicHistory) {
  function isAuthenticated() {
    var token = $window.sessionStorage.token;
    //console.log("authenticating now... = " + token);
    //console.log("checking token === null" + (token === null));
    //console.log("checking token === undefined" + (token === undefined));

    SERVER.CONFIG.headers = { "X-BSS-PeeBuddy": token };
    return !(token === null || token === undefined);
  }

  function login(user) {
    $http.post(SERVER.URL + "/api/v1/users", user, SERVER.CONFIG)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.auth_token;
        SERVER.CONFIG.headers = { "X-BSS-PeeBuddy": data.auth_token };
        $state.go('tab.map');
      })
      .error(function (err) {
        delete $window.sessionStorage.token;
        var error = err["errors"]["detail"];
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occurred',
          template: error
        });
      });
  }
  function register(user){
    $http.post(SERVER.URL + "/api/v1/users/register", user, SERVER.CONFIG)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.auth_token;
        SERVER.CONFIG.headers = { "X-BSS-PeeBuddy": data.auth_token };
        //console.log(data);
        $state.go('tab.map');
      })
      .error(function (err) {
        delete $window.sessionStorage.token;
        console.log(err);
        var error = err["errors"]["detail"];
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occurred',
          template: error
        });
      });
  }
  function logoff(){
//    console.log("deleting stuff");
    $timeout(function () {
      $window.sessionStorage.token = null;
      SERVER.CONFIG.headers['X-BSS-PeeBuddy'] = null;
      $ionicLoading.hide();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
      $state.go('signIn');
    }, 30);
  }

  return {
    isAuthenticated: isAuthenticated,
    login: login,
    register: register,
    logoff: logoff
  };
})

.factory('UserSession', function($resource, SERVER) {
   return $resource(SERVER.URL + "/api/v1/users");
})

.factory('UserRegistration',function($resource, SERVER){
  return $resource(SERVER.URL + "/api/v1/users/register");
})


.factory('Markers',function($http){
  var markers = [];

  function getMarkers(){

  }

  function getMarker(id){

  }

  return {
    getMarkers: getMarkers,
    getMarker: getMarker
  }
})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading, LocationService, $compile){

  var apiKey = false;
  var map = null;
  var infoWindow = new google.maps.InfoWindow();

  function initMap(scope){
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });

    var options = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      $ionicLoading.hide();

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
        //Load the markers
        loadMarkers(latLng, map, scope);


        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

      });

    }, function(error){
      console.log("Could not get location");
      console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
      //Load the markers
      //loadMarkers();
    });

  }
  //
  //function loadMarkers(latLng, map, scope){
  //  var places = LocationService.nearbySearch(latLng,map)
  //    .then(function(results) {
  //      console.log("loading markers");
  //      console.log(results);
  //      return results;
  //    }).then(function(results){
  //      for (var i = 0; i < results.length; i++) {
  //        var place = results[i];
  //        addMarker(place, map, scope);
  //      }
  //    }).catch(function(error){
  //      console.log('error' + error);
  //    });
  //  ////Get all of the markers from our Markers factory
  //  //Markers.getMarkers().then(function(markers){
  //  //
  //  //  console.log("Markers: ", markers);
  //  //
  //  //  var records = markers.data.result;
  //  //
  //  //  for (var i = 0; i < records.length; i++) {
  //  //
  //  //    var record = records[i];
  //  //    var markerPos = new google.maps.LatLng(record.lat, record.lng);
  //  //
  //  //    // Add the markerto the map
  //  //    var marker = new google.maps.Marker({
  //  //      map: map,
  //  //      animation: google.maps.Animation.DROP,
  //  //      position: markerPos
  //  //    });
  //  //
  //  //    var infoWindowContent = "<h4>" + record.name + "</h4>";
  //  //
  //  //    addInfoWindow(marker, infoWindowContent, record);
  //  //
  //  //  }
  //  //
  //  //});
  //
  //}
  //
  //function addMarker(place, map, scope) {
  //  var marker = new google.maps.Marker({
  //    map: map,
  //    name: place.name,
  //    position: place.geometry.location,
  //    icon: {
  //      url: 'img/gasstation-512.png', // http://maps.gstatic.com/mapfiles/circle.png',
  //      scaledSize: new google.maps.Size(35, 37)
  //    }
  //  });
  //  //$compile('<button ng-click="navigate(' + lat + ',' + lng +')">Navigate</button>')($scope);
  //
  //  var popupContent = $compile(
  //    '<div class="locationContent" id="locationContent">' +
  //    '<div class="locationName" ng-model="location.name">' + place.name + '</div>' +
  //    '<div class="locationPlaceId" ng-model="location.id">'+ place.id + '</div>' +
  //    '<div class="locationGeometryLocation" ng-model="location.latlng">'+ place.geometry.location + '</div>' +
  //    '<div class="ratingLabel">Cleanliness</div>' +
  //    '<div class="rating">' +
  //    '<input type="radio" id="star5" name="rating" value="5" ng-model="cleanRating.five"/><label for="star5"></label>' +
  //    '<input type="radio" id="star4" name="rating" value="4" ng-model="cleanRating.four"/><label for="star4"></label>' +
  //    '<input type="radio" id="star3" name="rating" value="3" ng-model="cleanRating.three"/><label for="star3"></label>' +
  //    '<input type="radio" id="star2" name="rating" value="2" ng-model="cleanRating.two"/><label for="star2"></label>' +
  //    '<input type="radio" id="star1" name="rating" value="1" ng-model="cleanRating.one"/><label for="star1"></label>' +
  //    '</div>' +
  //    '<input class="button button-block button-dark" id="rateButton" type="button" ng-click="angular.element(\'#map\').scope().rate(cleanRating);" value="Rate!">' +
  //    '</div>')(scope);
  //
  //  google.maps.event.addListener(marker, 'click', function () {
  //    infoWindow.setContent(popupContent[0]);
  //    infoWindow.open(map, this);
  //  });
  //}
  //
  //function addInfoWindow(marker, message, record) {
  //
  //  var infoWindow = new google.maps.InfoWindow({
  //    content: message
  //  });
  //
  //  google.maps.event.addListener(marker, 'click', function () {
  //    infoWindow.open(map, marker);
  //  });
  //
  //}

  return {
    init: function(){
      initMap();
    }
  }
})

.factory('LocationService',function($q, $http, SERVER) {
  function nearbySearch(latLng, map) {
    var deferred = $q.defer();
    var request = {
      location: latLng,
      radius: '500',
      types: ['gas_station']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        deferred.resolve(results);
      }
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  }

  function getLocations(locations){
    var deferred = $q.defer();
    var params = [];
    for (var i = 0; i < locations.length; i++) {
      params.push({ place_id: locations[i].place_id,
                    location: locations[i].geometry.location,
                    name: locations[i].name });
    }
//    console.log(params);
    $http({
      method: 'POST',
      url: SERVER.URL + '/api/v1/locations',
      data: { "locations": params },
      headers: SERVER.CONFIG.headers
    })
      .success(function(data){
        deferred.resolve(data);
      })
      .error(function(data,status){
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function rateLocation(rating, locationId) {
    var deferred = $q.defer();

 //   console.log(location);
    $http({
      method: 'POST',
      url: SERVER.URL + '/api/v1/rate',
      headers: SERVER.CONFIG.headers,
      data: {"klass": "location", "id": locationId, "score": rating, "dimension": "cleanliness"}
    }).success(function (data) {
        deferred.resolve(data);
      })
      .error(function (data, status) {
        deferred.reject(data);
      });
    return deferred.promise;

    }

  return {
    nearbySearch: nearbySearch,
    getLocations: getLocations,
    rate: rateLocation
  };
});


