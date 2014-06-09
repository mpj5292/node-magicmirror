// for navigator language
var lang = window.navigator.language;
// you can change the language
// var lang = 'en';

//change weather params here:
var weatherParams = {
    'q': 'Vienna,Austria',
    'units': 'metric',
    'lang': lang
};

// compliments:
var messages = {
    'show': true,
    'refresh': 60000,   // duration to display one message (millisec)  // 60 sec
    'data': [
        'Hallo, Mausl!',
        'Seas!',
        'Hallo, es ist schon morgen in der Früh!',
        'Awesome dude!',
        'Looking good today!',
        'You look nice!',
        'Enjoy your day!'
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