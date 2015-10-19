'use strict'
angular.module('main', ['apiServices', 'd3Directives'])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.controller('mainController', mainCtrl)

function mainCtrl ($scope, apiService) {
	var vm = this;

	var todaySolData = function () { 
		apiService.todayData(function(data){ 
			vm.today = data.results; 
		});
	}
	var monthSolData = function () { 
		apiService.monthData(function(data){ 
			vm.month = data.results.map(function (x) { 
   				return (Math.abs(x.min_temp_fahrenheit) - 32) * 5/9;
			});
		});
	}


	angular.extend(this,{ 
		today: todaySolData(), 
		month: monthSolData()
	}); 


}
// Why isn't today working as a variable why do I need to assign it to this with vm 