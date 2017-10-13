app.controller('DetailedController', function($scope, $http, $log, markerStorage, $ionicPlatform, $cordovaSQLite, $ionicLoading, $location, $ionicHistory){ 
	$ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: false
    });

    $scope.GoBack = function() {
    	 $ionicHistory.goBack();
    };
    $scope.selectedMarker = markerStorage.getMarker();
    $log.log($scope.selectedMarker);
})