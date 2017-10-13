app.controller('HomeController', function($scope, $rootScope, $templateCache, $ionicPlatform, $http, $timeout, $log, $ionicLoading, $cordovaSQLite, $ionicTabsDelegate, $location, $ionicHistory, $cordovaNetwork ){
	$ionicHistory.nextViewOptions({
        // disableAnimate: true,
        disableBack: true
    });
	$rootScope.direction = false;
	// var isOffline = $cordovaNetwork.isOffline();
	// console.log(isOffline);
	$scope.myGoBack = function() {
			$ionicHistory.goBack();
	}

	$scope.helper = {
	  Firstname: "",
	  Lastname: "",
	  Party: "",
	  District: "",
	  Municipality: "",
	  Area: ""
	}

	$scope.newParty = {
		id: '',
		name: ''
	}
	$scope.newDistrict= {
		id: '',
		name: ''
	}

	$scope.newMunicipality= {
		id: '',
		name: ''
	}

	$scope.newArea= {
		id: '',
		name: ''
	}

	$scope.Parties = [];
	$scope.Districts = [];
	$scope.Municipalitys = [];
	$scope.Areas = [];

	/***********************Get Helper Profile info*******************/
	var data = {
		id: window.localStorage.getItem('user_id'),
		authkey: window.localStorage.getItem('auth_key')
	};
	$log.warn(window.localStorage.getItem('user_id'));
	$scope.userData = data;
	$http({
		method: 'POST',
		url: 'http://posters.updownwherethere.dk/api/getprofile',
		headers: {
		   'X-Requested-With' :'XMLHttpRequest'
		 },
		 data: data
	}).then(function successCallback(response) {
		if(response.data.errors) {
			$scope.errorMessage = response.data.errors.password[0];
		} else {
			$scope.helper.Firstname = response.data.userprofile.firstname;
			$scope.helper.Lastname = response.data.userprofile.lastname;
			$scope.helper.Party = response.data.userprofile.party_id;
			$scope.helper.District = response.data.userprofile.district_id;
			$scope.helper.Municipality = response.data.userprofile.municipality_id;
			$scope.helper.Area = response.data.userprofile.area_id;
			/********************Get Districts **********************************/
				$http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/getdistricts',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 cache: false,
					 data: data
				}).then(function successCallback(response) {
					$scope.Districts = response.data.districts;
					angular.forEach($scope.Districts, function(value, key) {
					  if(value.district_value === $scope.helper.District) {
					  	$scope.newDistrict.name = value.district_name;
					  	$scope.newDistrict.id = value.district_value;
					  }
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
				/********************Get Areas **********************************/

				$http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/getareas',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 data: data
				}).then(function successCallback(response) {
					$scope.Areas = response.data.areas;
					angular.forEach($scope.Areas, function(value, key) {
					  if(value.area_value == $scope.helper.Area) {
					  	$scope.newArea.name = value.area_name;
					  	$scope.newArea.id = value.area_value;
					  }
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

				/********************Get Municipality **********************************/
					var municipalityData = {
						id: localStorage.getItem('user_id'),
						authkey: localStorage.getItem('auth_key'),
						district_id: $scope.helper.District
					}

					$http({
						method: 'POST',
						url: 'http://posters.updownwherethere.dk/api/getmunicipalities',
						headers: {
						   'X-Requested-With' :'XMLHttpRequest'
						 },
						 data: municipalityData
					}).then(function successCallback(response) {
						$scope.Municipalitys = response.data.municipalities;
						angular.forEach($scope.Municipalitys, function(value, key) {
						  if(value.municipality_value == $scope.helper.Municipality) {
						  	$scope.newMunicipality.name = value.municipality_name;
						  	$scope.newMunicipality.id = value.municipality_value;
						  }
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

					/********************Get Parties **********************************/

					$http({
						method: 'POST',
						url: 'http://posters.updownwherethere.dk/api/getparties',
						headers: {
						   'X-Requested-With' :'XMLHttpRequest'
						 },
						 data: data
					}).then(function successCallback(response) {
						$scope.Parties = response.data.parties;
						angular.forEach($scope.Parties, function(value, key) {
						  if(value.party_value === $scope.helper.Party) {
						  	$scope.newParty.name = value.party_name;
						  	$scope.newParty.id = value.party_value;
						  }
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

		}
	}, function errorCallback(response)  {
		 navigator.notification.confirm(
		        'Something went wrong please try again later.',  // message
		        alertDismissed,         // callback
		        'ERROR',            // title
		        'Done'                  // buttonName
		    );
	});

	/********************************************************************/

	/***********************Update Helper Profile info*******************/

	$scope.updateProfile = function() {
		$scope.helper_data = {'authkey' :  localStorage.getItem('auth_key'), 'id' : localStorage.getItem('user_id'),
		'newprofile' : {'firstname' : $scope.helper.Firstname, 'lastname' : $scope.helper.Lastname,
		'party_id': $scope.newParty.id, 'district_id' : $scope.newDistrict.id,
		'municipality_id' : $scope.newMunicipality.id, 'area_id' : $scope.newArea.id}};

		$http({
			method: 'POST',
			url: 'http://posters.updownwherethere.dk/api/setprofile',
			headers: {
			   'X-Requested-With' :'XMLHttpRequest'
			 },
			data: $scope.helper_data
		}).then(function successCallback(response) {
			navigator.notification.alert('Information successfully updated', function(){}, 'Success');
			$scope.success_update = 'Information successfully updated';
		}, function errorCallback(response)  {
			 navigator.notification.confirm(
			        'Something went wrong please try again later.',  // message
			        alertDismissed,         // callback
			        'ERROR',            // title
			        'Done'                  // buttonName
			    );
		});
	};

	/********************************************************************/

	/********************Get Districts **********************************/
	// $http({
	// 	method: 'POST',
	// 	url: 'http://posters.updownwherethere.dk/api/getdistricts',
	// 	headers: {
	// 	   'X-Requested-With' :'XMLHttpRequest'
	// 	 },
	// 	 data: data
	// }).then(function successCallback(response) {
	// 	$scope.Districts = response.data.districts;
	// 	angular.forEach($scope.Districts, function(value, key) {
	// 		$log.warn($scope.helper.District);
	// 	  if(value.district_value === $scope.helper.District) {
	// 	  	$scope.newDistrict.name = value.district_name;
	// 	  	$scope.newDistrict.id = value.district_value;
	// 	  }
	// 	});
	// }, function errorCallback(response)  {
	// 	 navigator.notification.confirm(
	// 	        'Something went wrong please try again later.',  // message
	// 	        alertDismissed,         // callback
	// 	        'ERROR',            // title
	// 	        'Done'                  // buttonName
	// 	    );
	// });

	$scope.getDistrict = function(option) {
		return {id: option.district_value, name: option.district_name};
	}

	$scope.changeMunicipality = function(newValue, oldValue) {
		municipalityData.district_id = newValue.id;
		$scope.newDistrict = newValue;
		$http({
		method: 'POST',
		url: 'http://posters.updownwherethere.dk/api/getmunicipalities',
		headers: {
		   'X-Requested-With' :'XMLHttpRequest'
		 },
		 data: municipalityData
	}).then(function successCallback(response) {
		$scope.Municipalitys = response.data.municipalities;
		angular.forEach($scope.Municipalitys, function(value, key) {
		  if(value.municipality_value == $scope.helper.Municipality) {
		  	$scope.newMunicipality.name = value.municipality_name;
		  	$scope.newMunicipality.id = value.municipality_value;
		  }
		});
	}, function errorCallback(response)  {
		 navigator.notification.confirm(
		        'Something went wrong please try again later.',  // message
		        alertDismissed,         // callback
		        'ERROR',            // title
		        'Done'                  // buttonName
		    );
	});
	}
	/********************************************************************/

	/********************Get Areas **********************************/
	$scope.getArea = function(option) {
		return {id: option.area_value, name: option.area_name};
	}

	$scope.getNewArea = function (newValue, oldValue) {
		$scope.newArea = newValue;
	}

	/********************************************************************/

	/********************Get Municipality **********************************/
	var municipalityData = {
		id: localStorage.getItem('user_id'),
		authkey: localStorage.getItem('auth_key'),
		district_id: $scope.helper.District
	}

	// $http({
	// 	method: 'POST',
	// 	url: 'http://posters.updownwherethere.dk/api/getmunicipalities',
	// 	headers: {
	// 	   'X-Requested-With' :'XMLHttpRequest'
	// 	 },
	// 	 data: municipalityData
	// }).then(function successCallback(response) {
	// 	$scope.Municipalitys = response.data.municipalities;
	// 	angular.forEach($scope.Municipalitys, function(value, key) {
	// 	  if(value.municipality_value == $scope.helper.Municipality) {
	// 	  	$scope.newMunicipality.name = value.municipality_name;
	// 	  	$scope.newMunicipality.id = value.municipality_value;
	// 	  }
	// 	});
	// }, function errorCallback(response)  {
	// 	 navigator.notification.confirm(
	// 	        'Something went wrong please try again later.',  // message
	// 	        alertDismissed,         // callback
	// 	        'ERROR',            // title
	// 	        'Done'                  // buttonName
	// 	    );
	// });

	$scope.getMunicipality = function(option) {
		return {id: option.municipality_value, name: option.municipality_name};
	}

	$scope.getNewMunicipality = function(newValue, oldValue) {
		$scope.newMunicipality = newValue;
	}

	/********************************************************************/

	/********************Get Parties **********************************/

	$http({
		method: 'POST',
		url: 'http://posters.updownwherethere.dk/api/getparties',
		headers: {
		   'X-Requested-With' :'XMLHttpRequest'
		 },
		 data: data
	}).then(function successCallback(response) {
		$scope.Parties = response.data.parties;
		angular.forEach($scope.Parties, function(value, key) {
		  if(value.party_value === $scope.helper.Party) {
		  	$scope.newParty.name = value.party_name;
		  	$scope.newParty.id = value.party_value;
		  }
		  // $log.log($scope.newParty.name);
		});
	}, function errorCallback(response)  {
		 navigator.notification.confirm(
		        'Something went wrong please try again later.',  // message
		        alertDismissed,         // callback
		        'ERROR',            // title
		        'Done'                  // buttonName
		    );
	});

	$scope.getParty = function(option) {
		return  {id: option.party_value, name: option.party_name};
	}

	$scope.getNewParty = function(newValue, oldValue) {
		$scope.newParty = newValue;
	}




	/********************************************************************/

	$scope.logout = function() {
		var query = "DELETE FROM helpers";
		$cordovaSQLite.execute(db, query).then(function(res) {
			// $log.log(res);
			window.localStorage.removeItem('user_id');
			window.localStorage.removeItem('auth_key');
			$ionicHistory.clearCache();
			$location.path("/login");
		 }, function (err) {
            console.error(err);
        });

	}

	$scope.goForward = function () {
			 var selected = $ionicTabsDelegate.selectedIndex();
			 if (selected != -1) {
					 $ionicTabsDelegate.select(selected + 1);
			 }
	 }

	$scope.goBack = function(scope) {
		var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
	}
});
