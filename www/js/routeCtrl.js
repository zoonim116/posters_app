app.controller('RouteController', function($scope, $cordovaGeolocation, markerStorage, $http, MapService, $state, $log, $http, $ionicPlatform, $ionicActionSheet, $timeout, $ionicLoading, $location, $ionicHistory){
	$ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: false
    });
	var geocoder = new google.maps.Geocoder;

    $scope.GoBack = function() {
    	 $ionicHistory.goBack();
    };

    $scope.selectedMarker = markerStorage.getMarker();
    $scope.myLocation;
    var Kopengagen = { lat: 55.6279, lng: 12.4145 };
    var mapOptions = {
      center: Kopengagen,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map1 = new google.maps.Map(document.getElementById("map1"), mapOptions);
    google.maps.event.addListenerOnce($scope.map1, 'idle', function(){

    });

    $scope.helper = {
    	Location : "Tap to get your location",
    	Target : ""
    };

    $scope.Modes = [{
    	name: 'Driving',
    	value: google.maps.DirectionsTravelMode.DRIVING
    },
    {
    	name: 'Walking',
    	value: google.maps.DirectionsTravelMode.WALKING
    },
    {
    	name: 'Bicycling',
    	value: google.maps.DirectionsTravelMode.BICYCLING
    }]

    $scope.Mode = {name: 'Driving',
    	value: google.maps.DirectionsTravelMode.DRIVING
    };

    $scope.changeMode = function(newValue, oldValue) {

        $log.log($scope.Mode);
        switch(newValue.value) {
            case 'BICYCLING' :

                $scope.Mode  = {name: 'Bicycling',
                        value: google.maps.DirectionsTravelMode.BICYCLING
                    };
                break;
            case 'WALKING' :

                $scope.Mode  = {name: 'Walking',
                        value: google.maps.DirectionsTravelMode.WALKING
                    };
                break;
            case 'DRIVING' :

                $scope.Mode  = {name: 'Driving',
                        value: google.maps.DirectionsTravelMode.DRIVING
                    };
                break;
        }
    	// $scope.Mode = newValue;
        $log.log();
        $log.log($scope.Mode);
    	$scope.makeDirection();
    }

    $scope.getMode = function(option) {
    	return {name: option.name, value: option.value}
    }


    $scope.makeDirection = function() {
        $location.path("/home/routes");
    	var directionsDisplay = new google.maps.DirectionsRenderer();
    	var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(null);
    	var request = {
	        origin: $scope.myLocation, //start point
	        destination: new google.maps.LatLng($scope.selectedMarker.lat, $scope.selectedMarker.lng), //finish point
	        travelMode: $scope.Mode.value, //mode
            avoidTolls: true
    	};

    	directionsService.route(request, function(response, status) {
	        if (status == google.maps.DirectionsStatus.OK) {
	            directionsDisplay.setDirections(response);
	        }
	    });
        directionsDisplay.setPanel(document.getElementById('right-panel'));
	    directionsDisplay.setMap($scope.map1);
    };

    $scope.getMyLocation = function() {
    	var options = {timeout: 10000, enableHighAccuracy: true};
    	$cordovaGeolocation.getCurrentPosition(options).then(function(position){
    		var currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    		$scope.myLocation = currentLatLng;
    		var latlng = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
    		$scope.makeDirection();
    		geocoder.geocode({'location': latlng}, function(results, status) {
    			if (status === 'OK') {
    				$scope.helper.Location = results[0].formatted_address;
    				$scope.$apply()
    				$log.log($scope.helper.Location);
    			} else {
    				$log.log(status);
    			}
    		})
    	// 	var marker = new google.maps.Marker({
			  //     map: $scope.map1,
			  //     animation: google.maps.Animation.DROP,
			  //     position: currentLatLng
			  // });
    	}, function(error){
	  	 navigator.notification.confirm(
		        'Please enable gps and try again',  // message
		        function() {},         // callback
		        'ERROR',            // title
		        'Done'                  // buttonName
		    );
	  });
    }

    if($scope.selectedMarker) {
    	var latlng = {lat: parseFloat($scope.selectedMarker.lat), lng: parseFloat($scope.selectedMarker.lng)};
    	geocoder.geocode({'location': latlng}, function(results, status) {
			if (status === 'OK') {
				$scope.helper.Target = results[0].formatted_address;
				$scope.$apply()
				var currentLatLng = new google.maps.LatLng($scope.selectedMarker.lat, $scope.selectedMarker.lng);
				var marker = new google.maps.Marker({
			      map: $scope.map1,
			      animation: google.maps.Animation.DROP,
			      position: currentLatLng
			  });
			} else {
				$log.log(status);
			}
		})
    }
});
