// 'use strict';
var apiService = angular.module('apiServices', [])

.service('apiService', function($http) {
	function todayData(callback){ 
		var today; 
		$http({
			url: '/sol/', 
			method: "GET"
		})
		.success(function(data) {
			var solDay = data.report.sol;  
			$http({
				url: '/sol/' + solDay, 
				method: "GET"
			})
			.success(callback)
		});
		
	}; 

	function monthData (callback) { 
		var month; 
		$http({ 
			url: '/month', 
			method: "GET"
		})
		.success(callback)	
		.error(function(data){ 
			console.log(data);
		})
	};

	return({ 
		todayData:todayData, 
		monthData: monthData
	});
	//
})
