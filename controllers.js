var app = angular.module('mirrorApp', ['ngResource', 'angularMoment', 'ngAnimate']);

jQuery.fn.updateWithText = function(text, speed) {
	var dummy = $('<div/>').html(text);

	if ($(this).html() != dummy.html())
	{
		$(this).fadeOut(speed/2, function() {
			$(this).html(text);
			$(this).fadeIn(speed/2, function() {
				//done
			});
		});
	}
};


function messageCtrl($scope, $timeout) {
	// displays a message on the center of the screen
	// iterates through messages defined in config.js
	
	$scope.message = messages[0];
	$scope.lastmessage = $scope.message;

	var messageSwitch = function() {
		while ($scope.message === $scope.lastmessage) {
			$scope.message = messages[Math.floor(Math.random()*messages.length)];
		}

		$('.message').updateWithText($scope.message, 4000);

		$scope.lastmessage = $scope.message;

		$timeout(messageSwitch, 30000);
	};
	messageSwitch();
}


function newsCtrl($scope, $resource, $timeout) {
	// convert an RSS feed to a JSON object via google API
	$scope.news = $resource('http://ajax.googleapis.com/ajax/services/feed/load',
		{q: newsfeed, num: 10, callback: 'JSON_CALLBACK', v: '1.0'},
		{get:{method:'JSONP'}});

	// the index of the currently displayed neewsitem
	$scope.newsIndex = 0;

	$scope.news.get(function(currNews) {
		var newsSwitch = function() {
			// assign new headline
			if (currNews.responseData.feed.entries[$scope.newsIndex] !== undefined)
				// this is a shame, i really do not know how to do a fade in/out in agularjs only
				$('.news').updateWithText(currNews.responseData.feed.entries[$scope.newsIndex].title, 4000);
				$timeout(newsSwitch, 10000);
			$scope.newsIndex = ($scope.newsIndex === currNews.responseData.feed.entries.length ? 0 : $scope.newsIndex+1);
		};
		newsSwitch();
	});
}


function calCtrl($scope) {
	new ical_parser('http://localhost:8888/proxy?url='+icalFeed, function(cal) {
		var raw_events = cal.getEvents();
		$scope.events = [];
		for (var i = 0; i < raw_events.length; i++) {
			// this is really ugly bad coding, but it works
			// parsing the date from ical to a js date
			// is there really no fromTimeString conversion like in python?
			raw_events[i]['timestamp'] = new Date(Date.parse(raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(0, 4)+'-'+
				raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(4, 6)+'-'+
				raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(6, 8)+
				raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(8, 11)+':'+
				raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(11, 13)+':'+
				raw_events[i]['DTSTART;VALUE=DATE-TIME'].substring(13, 16)));
			if (raw_events[i]['timestamp'] > new Date(Date.now())) {
				$scope.events.push(raw_events[i]);
			}
		}
	});
}


function dateCtrl($scope) {
	setInterval(function() {
       $scope.$apply(function() {
          $scope.currDate = new Date();
       });
    }, 1000);
}


function WeatherCtrl($scope, $resource) {

	$scope.weather = $resource('http://api.openweathermap.org/data/2.5/:action',
		{action: 'weather', q: weatherParams.q, units: weatherParams.units, lang: weatherParams.lang, callback: 'JSON_CALLBACK'},
		{get:{method:'JSONP'}});

	$scope.weather.get({action: 'weather'}, function(weatherNow) {
		var now = new Date();

		// bind weather data
		$scope.weatherNow = weatherNow;

		// get time of next sunrise or sunset
		$scope.weatherNow.sun = {};
		if (weatherNow.sys.sunrise*1000 < now && weatherNow.sys.sunset*1000 > now) {
			$scope.weatherNow.sun.nextStatus = 'set';
			$scope.weatherNow.sun.nextStatusTime = weatherNow.sys.sunset;
		}
		else {
			$scope.weatherNow.sun.nextStatus = 'rise';
			$scope.weatherNow.sun.nextStatusTime = weatherNow.sys.sunrise;
		}

	});

	$scope.weather.get({action: 'forecast'}, function(weatherForecast) {

		// iterate through the raw data
		// and determine min and max temp for a day
		$scope.weatherForecast = {};
		$scope.totalForecasts = 0;
		for (var i in weatherForecast.list) {
			var forecast = weatherForecast.list[i];
			var dateKey  = forecast.dt_txt.substring(0, 10);

			if ($scope.weatherForecast[dateKey] === undefined) {
				$scope.weatherForecast[dateKey] = {
					'timestamp': forecast.dt * 1000,
					'temp_min':  forecast.main.temp,
					'temp_max':  forecast.main.temp,
					'icon':      forecast.weather[0].icon
				};
				$scope.totalForecasts++;
			}
			else {
				$scope.weatherForecast[dateKey]['temp_min'] = (forecast.main.temp < $scope.weatherForecast[dateKey]['temp_min']) ? forecast.main.temp : $scope.weatherForecast[dateKey]['temp_min'];
				$scope.weatherForecast[dateKey]['temp_max'] = (forecast.main.temp > $scope.weatherForecast[dateKey]['temp_max']) ? forecast.main.temp : $scope.weatherForecast[dateKey]['temp_max'];
				if (forecast.dt_txt.substring(11, 19) === '12:00:00') {
					$scope.weatherForecast[dateKey]['icon'] = forecast.weather[0].icon;
				}
				
			}
		}
	});

}
