app.controller('MapController', function($scope, $ionicModal, $cordovaGeolocation, $ionicSlideBoxDelegate, $cordovaCamera,  markerStorage, $http, MapService, $state, $log, $http, $ionicPlatform, $ionicActionSheet, $timeout, $ionicLoading, $location, $ionicHistory){
  $ionicPlatform.ready(function() {
  	 	$ionicModal.fromTemplateUrl('templates/image-modal.html', {
	      scope: $scope,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.modal = modal;
	    });
	    $scope.image_src = '';
        $scope.stats;
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
		var geocoder = new google.maps.Geocoder();
	  	var options = {timeout: 10000, enableHighAccuracy: true};
	  // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
	 	$scope.currentDisctrict  =  'Select District';
	 	$scope.currentMunicipality  = 'Select Municipality';
	 	if($scope.newDistrict.name && $scope.newDistrict.name.length > 0) $scope.currentDisctrict = $scope.newDistrict.name;
	 	if($scope.newMunicipality.name && $scope.newMunicipality.name.length > 0) $scope.currentMunicipality = $scope.newMunicipality.name;
	 	// $scope.currentMunicipality;
	 	$scope.Municipal = [];
	 	if($scope.newDistrict.name && $scope.newDistrict.name.length > 0)  {

	 		MapService.getMunicipality($scope.userData, $scope.newDistrict.id).then(function(response) {
				$scope.Municipal = response.municipalities;
			});
	 	}
	    // var currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
	   
	    if($scope.newMunicipality.name && $scope.newMunicipality.name.length > 0) {
	    	geocoder.geocode({address: $scope.newMunicipality.name }, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
					console.log(status);
					$scope.map.setCenter(results[0].geometry.location);
				    $scope.map.setZoom(13);
			    }
		  	});	
		  	var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
		 	$scope.helperIndex = 0;
	    } else {
		 	var Kopengagen = { lat: 55.6279, lng: 12.4145 };
		    var mapOptions = {
		      center: Kopengagen,
		      zoom: 7,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };


		    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
		 	$scope.helperIndex = 0;
		    
		}
	    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
	    	var input = document.getElementById('pac-input');
  			
  			$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  			$scope.map.addListener('bounds_changed', function() {
           		searchBox.setBounds($scope.map.getBounds());
         	});
         
         
           var searchmarkers = [];
         // [START region_getplaces]
         // Listen for the event fired when the user selects a prediction and retrieve
         // more details for that place.
         searchBox.addListener('places_changed', function() {
           var places = searchBox.getPlaces();
       
           if (places.length == 0) {
             return;
           }
       
           // Clear out the old markers.
           searchmarkers.forEach(function(marker) {
             marker.setMap(null);
           });
           searchmarkers = [];
       
           // For each place, get the icon, name and location.
           var bounds = new google.maps.LatLngBounds();
           places.forEach(function(place) {
             var icon = {
               url: place.icon,
               size: new google.maps.Size(71, 71),
               origin: new google.maps.Point(0, 0),
               anchor: new google.maps.Point(17, 34),
               scaledSize: new google.maps.Size(25, 25)
             };
       
             // Create a marker for each place.
             searchmarkers.push(new google.maps.Marker({
               map: $scope.map,
               icon: icon,
               title: place.name,
               position: place.geometry.location
             }));
       
             if (place.geometry.viewport) {
               // Only geocodes have viewport.
               bounds.union(place.geometry.viewport);
             } else {
               bounds.extend(place.geometry.location);
             }
           });
           $scope.map.fitBounds(bounds);
         });

			  // var marker = new google.maps.Marker({
			  //     map: $scope.map,
			  //     animation: google.maps.Animation.DROP,
			  //     position: currentLatLng
			  // });      
		 
		});

		$scope.selectNewDistrict = function(newValue, oldValue) {
			$scope.currentDisctrict = newValue.name;
			MapService.getMunicipality($scope.userData, newValue.id).then(function(response) {
				$scope.Municipal = response.municipalities;
			});
		}
		var event = new Event('places_changed')
		$scope.selectNewMunicipality = function(newValue, oldValue) {
			$scope.currentMunicipality = newValue.name;
			$scope.selectedMunicipality = newValue.name;
			geocoder.geocode({address: $scope.selectedMunicipality }, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
					// console.log(status);
					$scope.map.setCenter(results[0].geometry.location);
				    $scope.map.setZoom(13);
			    }
		  	});
		}

		$scope.getNewMunicipality = function(option) {
			return {id: option.municipality_value, name: option.municipality_name};
		}

		$scope.getNewDistrict = function(option) {
			return {id: option.district_value, name: option.district_name};
		}

		/********************Get Statistic **********************************/
			MapService.getStatistic($scope.userData).then(function(response) {
 				$scope.stats = response;
 			});
		/*******************************************************************/

		/********************Get Posters **********************************/
				$http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/maps/getallhelperposters',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 data: $scope.userData
				}).then(function successCallback(response) {
					 $scope.Distric = [];
					 MapService.getDistricts($scope.userData).then(function(response) {
						$scope.Distric = response.districts;
					});
					$scope.Posters = response.data.posters;
					angular.forEach($scope.Posters, function(value, key) { 
						var marker = new google.maps.Marker({
					        position: {lat: parseFloat(value.lat), lng: parseFloat(value.lng) },
					        map: $scope.map,
							icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
					        //animation: google.maps.Animation.DROP,
					        draggable: false,
					        idmap: $scope.helperIndex++,
							id: (value.id) ? (value.id) : null,
							candidate_id: (value.candidate_id) ? (value.candidate_id) : null,
							helper_id: (value.helper_id) ? (value.helper_id) : null,
					     	status: (value) ? (value.status) : 0,
							urlphoto: (value.urlphoto) ? (value.urlphoto) : null,
					    });
					    MapService.getIcon(marker);
					    marker.addListener('click', function() {
					    	 // Show the action sheet
							$scope.getMenuItems(marker, value);
					    });
					});
				}, function errorCallback(response)  {
					 navigator.notification.confirm(
					        'Something went wrong please try again later.',  // message
					        alertDismissed,         // callback
					        'ERROR',            // title
					        'Done'                  // buttonName
					    );
				});
				/********************************************************************/
	 
	$scope.getMenuItems = function(marker, value) {
		switch (marker.status) { 
				case 10:
					if(marker.helper_id) {
						   var hideSheet = $ionicActionSheet.show({
						     buttons: [
						     	{text: 'Next status'},
						       	{ text: 'Upload photo' },
						       	{ text: 'View photo' },
						       	{ text: 'Navigate' },
						     ],
						     // destructiveText: 'Delete',
						     titleText: 'Modify',
						     cancelText: 'Cancel',
						     cancel: function() {
						          hideSheet();
						        },
						     buttonClicked: function(index) {
						     	switch(index) {
						     		case 0 :
						     			MapService.nextStatus($scope.userData, marker.id, marker.status).then(function(response) {
						     				marker.status = response.poster.status;
						     				MapService.getIcon(marker);
						     			});
						     			break;
						     		case 1 :
						     			$scope.updatePhoto($scope.userData, marker);
						     			// markerStorage.setMarker(value);
						     			// $location.path("/detailed");
					     				break;
				     				case 2 :
				     					if(marker.urlphoto) {
				     						$scope.image_src = marker.urlphoto;
				     						$scope.openModal();
				     					}
						     			// markerStorage.setMarker(value);
						     			// $location.path("/detailed");
					     				break;
				     				case 3 :
			     						markerStorage.setMarker(value);
			     						$location.path("/home/routes");
			     						break;
						     	}
						       return true;
						     }
						   });
					} else {
						   var hideSheet = $ionicActionSheet.show({
						     buttons: [
						       { text: 'Take poster' },
						     ],
						     // destructiveText: 'Delete',
						     titleText: 'Modify',
						     cancelText: 'Cancel',
						     cancel: function() {
						          hideSheet();
						        },
						     buttonClicked: function(index) {
						     	switch(index) {
						     		case 0 :
						     			MapService.takePoster($scope.userData, marker.id).then(function(response) {
											marker.helper_id = response.poster.helper_id;
											MapService.getIcon(marker);
										});
					     				break;
						     	}
						       return true;
						     }
						   });
					}
					break;
				case 20:
				 var hideSheet = $ionicActionSheet.show({
						     buttons: [
						     	{text: 'Next status'},
						       	{ text: 'Upload photo' },
						       	{ text: 'View photo'},
						       	{ text: 'Navigate' },
						     ],
						     // destructiveText: 'Delete',
						     titleText: 'Modify',
						     cancelText: 'Cancel',
						     cancel: function() {
						          hideSheet();
						        },
						     buttonClicked: function(index) {
						     	switch(index) {
						     		case 0 :
						     			MapService.nextStatus($scope.userData, marker.id, marker.status).then(function(response) {
						     				marker.status = response.poster.status;
						     				MapService.getIcon(marker);
						     			});
						     			break;
						     		case 1 :
						     			// markerStorage.setMarker(value);
						     			// $location.path("/detailed");
						     			$scope.updatePhoto($scope.userData, marker);
					     				break;
				     				case 2: 
					     				if(marker.urlphoto) {
				     						$scope.image_src = marker.urlphoto;
				     						$scope.openModal();
					     				}
					     				break;
				     				case 3 :
			     						markerStorage.setMarker(value);
			     						$location.path("/home/routes");
			     						break;
						     	}
						       return true;
						     }
						   });
				break;
				case 30:
				 var hideSheet = $ionicActionSheet.show({
						     buttons: [
						       	{ text: 'Upload photo' },
						       	{ text: 'View photo'},
						       	{ text: 'Navigate' },
						     ],
						     // destructiveText: 'Delete',
						     titleText: 'Modify',
						     cancelText: 'Cancel',
						     cancel: function() {
						          hideSheet();
						        },
						     buttonClicked: function(index) {
						     	switch(index) {
						     		case 0 :
						     			// markerStorage.setMarker(value);
						     			// $location.path("/detailed");
						     			$scope.updatePhoto($scope.userData, marker);
					     				break;
				     				case 1 :
				     					if(marker.urlphoto) {
				     						$scope.image_src = marker.urlphoto;
				     						$scope.openModal();
				     					}
				     					break;
				     				case 2 :
			     						markerStorage.setMarker(value);
			     						$location.path("/home/routes");
						     	}
						       return true;
						     }
						   });
				break;
			}
	}

	$scope.updatePhoto = function(data, marker) {
		  var options = {
		      quality: 100,
		      destinationType: Camera.DestinationType.DATA_URL,
		      sourceType: Camera.PictureSourceType.CAMERA,
		      allowEdit: true,
		      encodingType: Camera.EncodingType.JPEG,
		      popoverOptions: CameraPopoverOptions,
		      saveToPhotoAlbum: false,
			  correctOrientation:true
		   };
		    $cordovaCamera.getPicture(options).then(function(imageData) {
		      src = "data:image/jpeg;base64," + imageData;
		      MapService.uploadPhoto(data, src, marker.id).then(function(response) {
		      	marker.urlphoto = response.poster.urlphoto;
		      	MapService.getIcon(marker);
		      	navigator.notification.alert('Photo successfully updated', function(){

		      	}, 'Success');
		      });

		    }, function(err) {
		      $log.log(err);
		    });
	}

				
  });
});
