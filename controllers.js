var app = angular.module('mirrorApp', ['ngResource', 'angularMoment', 'ngAnimate']);


// changes the text of an element and fades it in
// this really needs to get ported to angularjs
jQuery.fn.updateWithText = function(text, speed) {
	if ($(this).html() != $('<div/>').html(text)) {
		$(this).fadeOut(speed/2, function() {
			$(this).html(text);
			$(this).fadeIn(speed/2, function() {});
		});
	}
};


// displays a message on the center of the screen
// iterates through messages defined in config.js
function messageCtrl($scope, $timeout) {

	$scope.messagesShow = messages.show;
	
	$scope.message = messages.data[0];
	$scope.lastmessage = $scope.message;

	var messageSwitch = function() {
		console.log("Switching message.");

		//select random message
		while ($scope.message === $scope.lastmessage) {
			$scope.message = messages.data[Math.floor(Math.random()*messages.data.length)];
		}

		$('.message').updateWithText($scope.message, 4000);
		$scope.lastmessage = $scope.message;
		$timeout(messageSwitch, messages.refresh);
	};
	messageSwitch();
}


// displays headlines from an RSS newsfeed
function newsCtrl($scope, $resource, $timeout) {

	// convert an RSS feed to a JSON object via google API
	$scope.news = $resource('http://ajax.googleapis.com/ajax/services/feed/load',
		{q: newsfeed.url, num: newsfeed.limit, callback: 'JSON_CALLBACK', v: '1.0'},
		{get:{method:'JSONP'}});

	$scope.newsfeedShow = newsfeed.show;

	var getHeadlines = function() {
		console.log("Getting headlines from " + newsfeed.url);

		// the index of the currently displayed newsitem
		$scope.newsIndex = 0;

		// iterate through the list of headlines
		// and display them
		if (newsfeed.show) {
			$scope.news.get(function(currNews) {
				var newsSwitch = function() {
					console.log("Switching Headline.");
					// assign new headline
					if (currNews.responseData.feed.entries[$scope.newsIndex] !== undefined) {
						$('.news').updateWithText(currNews.responseData.feed.entries[$scope.newsIndex].title, 4000);
						$scope.newsIndex++;
						$timeout(newsSwitch, newsfeed.refresh);
					}
					else {
						$timeout(getHeadlines, newsfeed.refresh);
					}
				};
				newsSwitch();
			});
		}
		else {
			$timeout(getHeadlines, newsfeed.refresh);
		}
	};
	getHeadlines();
}

// shows the items from an ical feed
function calCtrl($scope, $timeout) {
	var cal = function() {
		console.log("Getting calendar data.");
		new ical_parser('http://localhost:8888/proxy?url='+icalFeed.url, function(raw_cal) {
			var raw_events = raw_cal.getEvents();
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
		$timeout(cal, icalFeed.refresh);
	};
	cal();
}


// show the current date and time
function dateCtrl($scope) {
	setInterval(function() {
       $scope.$apply(function() {
          $scope.currDate = new Date();
       });
    }, 1000);
}


// shows the current weather and the forecast
function WeatherCtrl($scope, $resource, $timeout) {

	$scope.weather = $resource('http://api.openweathermap.org/data/2.5/:action',
		{action: 'weather', q: weatherParams.q, units: weatherParams.units, lang: weatherParams.lang, callback: 'JSON_CALLBACK'},
		{get:{method:'JSONP'}});

	// get the current weather data
	var currWeather = function() {
		console.log("Getting current weather.");
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
		$timeout(currWeather, weatherParams.weatherRefresh);  // refresh every 10 minutes
	};
	currWeather();

	// get the weather forcast for the next days
	var forecast = function() {
		console.log("Getting weather forecast.");
		$scope.weather.get({action: 'forecast'}, function(weatherForecast) {

			// iterate through the raw data
			// and determine min and max temp for a day
			$scope.weatherForecast = {};
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
		$timeout(forecast, weatherParams.forecastRefresh);  // refresh every 30 minutes
	};
	forecast();

}
