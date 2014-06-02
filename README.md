MagicMirror
===========

This is a port of [MagicMirror](https://github.com/MichMich/MagicMirror) to node.js. The super magic interface of a personal Magic Mirror. More information about this project can be found on my [blog](http://michaelteeuw.nl/tagged/magicmirror).

#Differences to the orginal project

* Removed the refresh logic and added a vagrant file to test the configuration in a virtualized environment.
* Removed the socket.io/dishwasher stuff
* Moved config.js to root

#TODO

* Port jquery to angular.js.
* Add a proximity sensor to turn the screen only on if someone is on front of the mirror
* Add a button to select a news headline and display the whole text
* Custimized and selectable profiles for each family member
* And finally face recognition!-)))
