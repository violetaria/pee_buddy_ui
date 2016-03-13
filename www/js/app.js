// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova','ngResource', 'ionic.rating'])
  .constant('SERVER', {
    //URL: 'https://peebuddy-api.herokuapp.com',
    URL: 'http://localhost:3000',
    CONFIG: {
      headers: { "X-BSS-PeeBuddy": null }
    }
  })
  .constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null
  })

.run(function($ionicPlatform, UserService, $rootScope, $state) {
  //stateChange event
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    console.log("state changing");
    console.log(toState.data.authRequired);
    console.log(!UserService.isAuthenticated());
    console.log(toState.data.authRequired && !UserService.isAuthenticated());
    if (toState.data.authRequired && !UserService.isAuthenticated()){ //Assuming the AuthService holds authentication logic
      // User isn’t authenticated
      console.log("user not authenticated!");
      $state.transitionTo("signIn");
      event.preventDefault();
    }
  });

  $ionicPlatform.ready(function() {
    //setTimeout(function() {
    //  if (navigator.splashscreen){
    //  navigator.splashscreen.hide();
    //  }
    //}, 2000);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    $rootScope.signOut = function() {
      console.log("signing out");
      UserService.logoff();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('register',{
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl',
      data: {authRequired: false}
    })
    .state('signIn', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl',
      data: {authRequired: false}
    })
    .state('signOut',{
      url: '/sign-out',
      controller: 'SignOutCtrl',
      data: {authRequired: false}
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
      // TODO - Add Controller here
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
      data: {authRequired: false}
    })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    data: {authRequired: true},
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  });

  //.state('tab.favorites', {
  //    url: '/favorites',
  //    data: {authRequired: true},
  //    views: {
  //      'tab-favorites': {
  //        templateUrl: 'templates/tab-favorites.html',
  //        controller: 'FavoritesCtrl'
  //      }
  //    }
  //  })
  //  .state('tab.chat-detail', {
  //    url: '/chats/:chatId',
  //    data: {authRequired: true},
  //    views: {
  //      'tab-chats': {
  //        templateUrl: 'templates/chat-detail.html',
  //        controller: 'ChatDetailCtrl'
  //      }
  //    }
  //  })

  //.state('tab.account', {
  //  url: '/account',
  //  data: {authRequired: true},
  //  views: {
  //    'tab-account': {
  //      templateUrl: 'templates/tab-account.html',
  //      controller: 'AccountCtrl'
  //    }
  //  }
  //});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');
  //$urlRouterProvider.otherwise('/sign-in');

});
