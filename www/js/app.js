// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

var app = angular.module('starter', ['ionic', 'ngCordova', 'ngMessages', 'ionic-modal-select']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
      })
      .state('detailed', {
        url: '/detailed',
        templateUrl: 'templates/detailed.html',
        controller: 'DetailedController'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'templates/homepage.html',
        controller: 'HomeController'
      })
      .state('map', {
        url: '/map',
        templateUrl: 'templates/tabs/map.html',
        controller: 'MapController',
        cache: false,
        parent: 'home'
      })
      .state('routes', {
        url: '/routes',
        templateUrl: 'templates/tabs/routes.html',
        controller: 'RouteController',
        parent: 'home'
      })
      .state('posters', {
        url: '/posters',
        templateUrl: 'templates/tabs/posters.html',
        controller: 'PosterController',
        parent: 'home'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/tabs/profile.html',
        controller: 'ProfileController',
        parent: 'home'
      });
    $urlRouterProvider.otherwise('/login');
});


app.run(function($ionicPlatform, $cordovaSQLite, $location) {
  document.addEventListener("offline", onOffline, false);

  function alertDismissed () {
    navigator.app.exitApp();
  }

  function onOffline() {
      // Handle the offline event
      navigator.notification.confirm(
        'There is no internet connection. Application will be closed.',  // message
        alertDismissed,         // callback
        'ERROR',            // title
        'Done'                  // buttonName
    );
  }
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({name: 'helpers.db', location: 'default'});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS helpers (id integer primary key, user_id text, auth_key text)");
    var query = "SELECT * FROM helpers";
    $cordovaSQLite.execute(db, query).then(function(res) {
           if(res.rows.length > 0) {
              window.localStorage.setItem('user_id', res.rows.item(0).user_id);
              window.localStorage.setItem('auth_key', res.rows.item(0).auth_key);
                $location.path("/home/profile");
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
  });
})
