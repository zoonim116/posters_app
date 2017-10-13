app.factory('MapService', function( $http, $log, $ionicPlatform) {
	var selectedMarker;
	return {
		getIcon: function(marker) {
			switch (marker.status) {
          		case 10:
					if (marker.urlphoto == undefined) {
						if (marker.helper_id == undefined)
							marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow.png');		  
						else
							marker.setIcon('http://maps.google.com/mapfiles/ms/icons/orange.png');	
					}
					else {
						if (marker.helper_id == undefined)
					    	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');	
						else
							marker.setIcon('http://maps.google.com/mapfiles/ms/icons/orange-dot.png');		
					}
              		break;
    			case 20:
					if (marker.urlphoto == undefined)
				    	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green.png');
					else
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
	              	break;
    			case 30:
					if (marker.urlphoto == undefined)
				    	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red.png');
					else
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');	
	              	break;
			    case 40:
					if (marker.urlphoto == undefined)
				     	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			       break;
			    case 50:
				     marker.setIcon('https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png');
				     marker.draggable = true;
				     myposition.push(marker);
			           break;
			    
			     }
		},

		getDistricts : function(data) {
				/********************Get Districts **********************************/
				return $http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/getdistricts',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 data: data
				}).then(function successCallback(response) {
					return response.data;
				});
				/********************************************************************/
		},

		getMunicipality : function(data, district_id) {
			data.district_id = district_id;
			return $http({
				method: 'POST',
				url: 'http://posters.updownwherethere.dk/api/getmunicipalities',
				headers: {
				   'X-Requested-With' :'XMLHttpRequest'
				 },
				 data: data
			}).then(function successCallback(response) {
				return response.data;
			});
		},

		getStatistic: function(data) {
			return $http({
				method: 'POST',
				url: 'http://posters.updownwherethere.dk/api/maps/gethelperstatistic',
				headers: {
				   'X-Requested-With' :'XMLHttpRequest'
				 },
				 data: data
			}).then(function successCallback(response) {
				return response.data;
			});
		},

		takePoster : function(data, poster) {
			data.posterfortake = {poster_id: poster};
			return 	$http({
						method: 'POST',
						url: 'http://posters.updownwherethere.dk/api/maps/takeposter',
						headers: {
						   'X-Requested-With' :'XMLHttpRequest'
						 },
						 data: data
					}).then(function successCallback(response) {
						return response.data;
					});
		},

		nextStatus : function(data, poster, status) {
			if (status < 30) {
				status += 10;
				data.posterforupdate = {poster_id: poster, poster_status: status};
				return 	$http({
							method: 'POST',
							url: 'http://posters.updownwherethere.dk/api/maps/updatehelperoneposter',
							headers: {
							   'X-Requested-With' :'XMLHttpRequest'
							 },
							 data: data
						}).then(function successCallback(response) {
							return response.data;
						});
			}
		},
		uploadPhoto: function(data, picture, poster) {
			data.image = picture;
			data.poster_id = poster;
			return $http({
					method: 'POST',
					url: 'http://posters.updownwherethere.dk/api/maps/helperuploadphoto',
					headers: {
					   'X-Requested-With' :'XMLHttpRequest'
					 },
					 data: data
				}).then(function successCallback(response) {
					return response.data;
				});
		}
	}
})
.service('markerStorage', function() {
	var _marker = '';
	return {
		setMarker: function(marker) {
			_marker = marker;
		},
		getMarker: function() {
			return _marker;
		}
	}
});

