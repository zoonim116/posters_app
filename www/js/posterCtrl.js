app.controller('PosterController', function($scope, $http, $log, $ionicSlideBoxDelegate, PosterService, $ionicModal, $ionicPlatform, $cordovaSQLite, $ionicLoading, $location, $ionicHistory){ 
	$ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: false
    });

    $scope.GoBack = function() {
    	 $ionicHistory.goBack();
    };

    var geocoder = new google.maps.Geocoder;

    PosterService.getAll($scope.userData).then(function(response){
    	$scope.myPosters = response.posters;
    });

    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
	      scope: $scope,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.modal = modal;
	    });

	    $scope.image_src = '';
        
     	$scope.openModal = function() {
	      $scope.modal.show();
	      // Important: This line is needed to update the current ion-slide's width
	      // Try commenting this line, click the button and see what happens
	      $ionicSlideBoxDelegate.update();
	    };

	    $scope.closeModal = function() {
	      $scope.modal.hide();
	    };

	    // Cleanup the modal when we're done with it!
	    $scope.$on('$destroy', function() {
	      $scope.modal.remove();
	    });

    $scope.showImg = function(poster) {
    	$scope.image_src = poster.urlphoto;
		$scope.openModal();
    }

    $scope.getLocationAddress = function(latitude, longitude) {
		var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
		geocoder.geocode({'location': latlng}, function(results, status) {
    			if (status === 'OK') { 
    				return results[0].formatted_address;
    			} else {
    				$log.log(status);
    			}
    		})
	}

})