var express = require('express'), 
	app = express(), 
	http = require('request'), 
	Promise = require('promise'), 
	bodyParser = require('body-parser'), 
	moment = require('moment');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({
  extended: true
}));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});


app.get('/month', function(req, res){ 
	var currentDay = moment().format('YYYY MM DD').replace(/\s+/g, '-');
	console.log('currentDay', currentDay);
	var startDay = currentDay.slice(0,8) + '01'; 
	console.log('startDay', startDay);
	http('http://marsweather.ingenology.com/v1/archive/?terrestrial_date_start=' + startDay +  '&terrestrial_date_end=' + currentDay, function (error, response, body) { 
		if (error) { 
			console.log(error);
		}
		var data = JSON.parse(body);
		res.json(data);


	})

}); 
app.get('/sol', function(req, res) { 
	http('http://marsweather.ingenology.com/v1/latest/', function(error, response, body) { 
		if (error) { 
			console.log(error);
		}
		var data = JSON.parse(body);
		res.json(data);
	});
});

app.get('/sol/:data', function(req, res) { 
	var solDay = JSON.parse(req.params.data);
	http('http://marsweather.ingenology.com/v1/archive/?sol=' + solDay, function(error, respone, body) { 
		var data = JSON.parse(body);
		res.json(data);
	});
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://' + port);
});