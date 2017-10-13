app.factory('PosterService', function( $http, $log, $ionicPlatform) { 
	return {
		getAll : function(data) {
			return $http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/maps/gethelperposterswithphoto',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 data: data
				}).then(function successCallback(response) {
					return response.data;
				});
		}
	}
});