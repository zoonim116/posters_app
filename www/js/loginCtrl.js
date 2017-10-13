app.controller('LoginController', function($scope, $http, $log, $ionicPlatform, $cordovaSQLite, $ionicLoading, $location, $ionicHistory){
	$ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: false
    });

	$scope.person = {
	  username: "",
	  password: "",
	}

    $scope.$on("$ionicView.enter", function(scopes, states){
        $log.log("CLEC+AR!!!!");
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
  });

	$scope.$log = $log;
    $scope.go = function(person) {
        console.log(person)
    	if(person.username.length > 1 && person.password.length > 1) { 
    		var data = {
    			username: person.username,
    			password: person.password
    		};
            console.log("ASD");
    		$http({
    			method: 'POST',
    			url: 'http://posters.updownwherethere.dk/api/login',
    			headers: {
				   'X-Requested-With' :'XMLHttpRequest'
				 },
				 data: data
    		}).then(function successCallback(response) {
                $log.log(response);
    			if(response.data.errors) {
                    navigator.notification.alert(response.data.errors.password[0], function(){}, 'Error');
    				// $scope.errorMessage = response.data.errors.password[0];
    			} else {
    				var query = "INSERT INTO helpers (user_id, auth_key) VALUES (?,?)";
				        $cordovaSQLite.execute(db, query, [response.data.id, response.data.authkey]).then(function(res) {
				             window.localStorage.setItem('user_id', response.data.id);
                             $log.debug(response.data.id);
                             window.localStorage.setItem('auth_key', response.data.authkey);
                             $ionicHistory.clearCache();
                            $location.path("/home/profile");
				        }, function (err) {
				            $log.error(err);
				        });
    			}
    		}, function errorCallback(response)  {
    			 navigator.notification.confirm(
				        'Something went wrong please try again later.',  // message
				        alertDismissed,         // callback
				        'ERROR',            // title
				        'Done'                  // buttonName
				    );
    		});
    	} 
    }
});
