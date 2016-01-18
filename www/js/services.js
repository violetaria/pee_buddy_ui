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

.factory('UserSession', function($resource) {
    console.log("user session factory");
    return $resource("http://localhost:3000/api/v1/users"); // .json");
})

.factory('Users',function(){
    return {
      signOff: function(){
        return null;

      },
      forgotPassword: function(){
        return null;
      }
    }
})

.factory('PeeLocations',function($q) {
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

