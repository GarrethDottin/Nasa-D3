var mainService = angular.module('d3Directives', [])
.directive('d3Scatterplot', ['d3Service', function(d3Service) {
	return {
		link: function(scope, element, attrs) {

			window.onresize = function () { 
					d3.select("svg").remove();
					// width = Math.floor(window.innerWidth * .666);
					// height = Math.Floor(window.innerWidth * .666);
					scope.render();
			}

    		scope.render = function () {
    			var width = Math.floor(window.innerWidth * .666);
				var	height = Math.floor(window.innerWidth * .666);
    			var defaultWidth = width || 700; 
    			var defaultHeight = height ||  500; 

				var margin = {top: 20, right: 40, bottom: 20, left: 20};
				var w = defaultWidth - margin.left - margin.right,
    			h = defaultHeight - margin.top - margin.bottom;

				var dataset = [
				  [256, 60], [480, 270], [250, 150], [100, 99], [330, 285],
				  [410, 36], [475, 132], [55, 180], [85, 63], [220, 240]
				];

				var svg = d3.select('#scatterplot')
					.append("svg")
					.classed("scatterplot", true)
					.attr("width", w)
					.attr("height", h)
    				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var axisScale = d3.scale.linear()
					.domain([0,600])
					.range([0,580]);

				var xAxis = d3.svg.axis()
					.scale(axisScale)
					.orient("bottom")
					.ticks(10);

				var yScale = d3.scale.linear()
					.domain([0,350])
					.range([400,0])

				var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(5);

				svg.append("g")
				    .attr("transform", "translate(" + margin.left * 1.8 + ",0)")
				    .call(yAxis);

				var axisGroup = svg.append("g")
					.call(xAxis)
					.attr("transform", "translate(" + margin.left +"," + (402) + ")");

				var circles = svg.selectAll("circle")
					.data(dataset)
					.enter()
					.append("circle")
					
				var circleAttributes = circles	
					.attr("cx", function(d){
						return d[0] * 1.8;
					})
					.attr("cy", function(d){ 
						return d[1];
					})
					.attr("r", function(d){ 
						return Math.floor(Math.sqrt(d[1]) * 1.15);
					})
					.attr("fill", "grey")


				$('svg circle').tipsy({ 
					gravity: 'w', 
					html: true, 
					title: function () { 
						var displayData = this.attributes.cx.textContent; 
						return '<span>' + displayData + '</span>';
					}
				}); 

				var numberOfTicks = 15;

				var yAxisGrid = yAxis.ticks(numberOfTicks)
				    .tickSize(w, 0)
				    .tickFormat("")
				    .orient("right");

				var xAxisGrid = xAxis.ticks(numberOfTicks)
				    .tickSize(-h, 100)
				    .tickFormat("")
				    .orient("top")

				svg.append("g")
				    .classed('y', true)
				    .classed('grid', true)
				    .attr("transform", "translate(40,0)")
				    .call(yAxisGrid);

				svg.append("g")
				    .classed('x', true)
				    .classed('grid', true)
				    .attr("transform", "translate(34,-50)")
				    .call(xAxisGrid);



			};

	    	scope.render();
		}
	}
}])

.factory('d3Service', ['$document', '$q', '$rootScope', 'apiService',
	function($document, $q, $rootScope, apiService) {
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
      scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.js';
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