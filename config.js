// for navigator language
var lang = window.navigator.language;
// you can change the language
var lang = 'en';

//change weather params here:
var weatherParams = {
    'id': '4994358',
    'units': 'imperial',
    //'lang': lang,
    'weatherRefresh': 600000,  // duration to refresh the current weather  // 10 min
    'forecastRefresh': 18000000,  // duration to refresh the current forecast  // 30 min

};

// compliments:
var messages = {
    'show': true,
    'refresh': 60000,   // duration to display one message (millisec)  // 60 sec
    'data': [
        'Hi, Matt',
        'You look nice!'
    ]
};

// feed to display the heandlines in the bottom
var newsfeed = {
    'show': true,
    'url': 'http://derStandard.at/?page=rss&ressort=Seite1',
    'limit': 10,  // number of headlines to pull
    'refresh': 20000  // duration to display one headline (millisec)  // 20 sec
};

// ical feed
var icalFeed = {
    'url': 'http://webtermine.at/?ec3_ical_wien',
    'refresh': 600000  // duration to refresh the calendar (millisec)  // 10 min
};