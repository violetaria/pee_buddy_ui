angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('UserService', function($http,SERVER,$window,$state, $ionicPopup, $timeout,$ionicLoading, $ionicHistory) {
  function isAuthenticated() {
    var token = $window.sessionStorage.token;
    console.log("authenticating now... = " + token);
    SERVER.CONFIG.headers['X-BSS-PeeBuddy']  = token;
    return !(token === null);
  }

  function login(user) {
    $http.post(SERVER.URL + "/api/v1/users", user, SERVER.CONFIG)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.auth_token;
        SERVER.CONFIG.headers['X-BSS-PeeBuddy'] = data.auth_token;
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
        SERVER.CONFIG.headers['X-BSS-PeeBuddy'] = data.auth_token;
        console.log(data);
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
    console.log("deleting stuff");
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

.factory('LocationService',function($q) {
  return {
    nearbySearch: function(latLng,map){
      var deferred = $q.defer();

      var request = {
        location: latLng,
        radius: '500',
        types: ['gas_station']
      };

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
          deferred.resolve(results);
        }
      }, function(error){
        deferred.reject(error);
      });

      return deferred.promise;
      //
      //function callback (results,status){
      //  if (status == google.maps.places.PlacesServiceStatus.OK) {
      //    console.log('callback places' + results);
      //    return results;
      //  }
      //}
    }
  }
});

