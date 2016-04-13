// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'LocalStorageModule'])

.run(function($ionicPlatform) {
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
  });
})

.controller('AppCtrl', function($scope, $ionicPlatform, localStorageService){
    
    var TOKEN = "64e95de1b6aa3a94a00e0b434418dd4b86bcfaae";
    
    function logMsg( msg ){
        var now = new Date();
        var logs = localStorageService.get('logs') || [];
        msg = now.toISOString() + ': ' + msg;
        logs.push(msg);
        localStorageService.set('logs', logs);
    }
    
    $ionicPlatform.ready(function(){
    
        if(window.cordova && window.BackgroundGeolocation){
            var bgGeo = window.BackgroundGeolocation;
            // Listen to location events & errors.
            bgGeo.on('location', function(loc, taskId){
                bgGeo.finish(taskId);
            }, function(e){
                logMsg(e);
            });

            // Fired whenever state changes from moving->stationary or vice-versa.
            bgGeo.on('motionchange', function(isMoving) {
                logMsg("Motion Change Event -> isMoving: " + JSON.stringify(isMoving));
            });
            
            bgGeo.configure({
                // Geolocation config
                desiredAccuracy: 0,
                distanceFilter: 10,
                stationaryRadius: 50,
                locationUpdateInterval: 1000,
                fastestLocationUpdateInterval: 5000,

                // Activity Recognition config
                activityType: 'AutomotiveNavigation',
                activityRecognitionInterval: 5000,
                stopTimeout: 5,

                // Application config
                debug: true,
                stopOnTerminate: false,
                startOnBoot: true,

                // HTTP / SQLite config
                url: 'http://107.23.22.176/api/v1/coordinates',
                method: 'POST',
                autoSync: true,
                maxDaysToPersist: 1,
                headers: {
                    "Authorization": "Token " + TOKEN,
                    "Content-Type": "application/json"
                }
            }, function(state) {
                // This callback is executed when the plugin is ready to use.
                console.log( 'BackgroundGeolocation ready: ', JSON.stringify(state) );
                if (!state.enabled) {
                    bgGeo.start();
                }
            }); 
        }     
    });
    
});