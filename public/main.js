angular.module('main', [])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
])
.service('apiService', function($http){
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
.controller('mainController', mainCtrl)
.factory('d3Service', ['$document', '$q', '$rootScope',
	function($document, $q, $rootScope) {
		var d = $q.defer();
		function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.d3); });
    }
      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = function () {
      	if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
      	d3: function() { return d.promise; }
      };
  }])
.directive('d3Bars', ['d3Service', 'apiService', function(d3Service, apiService) {
	return {
		link: function(scope, element, attrs) {
			d3Service.d3().then(function(d3) {


          // Browser onresize event
            window.onresize = function() {
          		scope.$apply();
          	};

          // hard-code data

          // Watch for resize event
          scope.$watch(function() {
          	return angular.element(window)[0].innerWidth;
          }, function() {
          	scope.render(scope.data);
          });

	        scope.render = function(data) {
	            var m = [80, 80, 80, 80]; // margins
	            var margins = {
	            	c1: 80, 
	            	c2: 80, 
	            	c3: 80, 
	            	c4: 80
	            };
				var w = 1000 - margins.c2- margins.c3; // width
				var h = 400 - margins.c1 - margins.c3; // height
				var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
				debugger
				var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
				var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
				var line = 
				d3.svg.line()
					.x(function(d,i) { 
						return x(i); 
					})
					.y(function(d) { 
						return y(d); 
					})
					var graph = d3.select("#graph").append("svg:svg")
						.attr("width", w + margins.c2 + margins.c4)
						.attr("height", h + margins.c1 + margins.c3)
						.append("svg:g")
						.attr("transform", "translate(" + margins.c4 + "," + margins.c1 + ")");
					var xAxis = d3.svg.axis().scale(x);
					graph.append("svg:path").attr("d", line(data));
			}
		});
		}
	};
}])

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
   				return x.min_temp_fahrenheit
			});
		});
	}


	angular.extend(this,{ 
		today: todaySolData(), 
		month: monthSolData()
	}); 


}
// Why isn't today working as a variable why do I need to assign it to this with vm 