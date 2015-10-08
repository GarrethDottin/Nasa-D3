var main = angular.module('main', []); 

main.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);
main.controller('mainController', function($scope,$http) {

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
		.success(function(data) { 
			$scope.solData = data;
		})
	})
	.error(function(data) { 
		console.log('Error:' + data);
	});
	$http({ 
		url: '/month', 
		method: "GET"
	})
	.success(function(data) { 
		console.log(data); 
	})	
	.error(function(data){ 
		console.log(data);
	})
});