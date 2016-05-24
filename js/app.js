"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google: false */

var map;

function initMap() {

	var myTestEvent = {
		"date": "2016-10-27",
		"venue": "Cornwall Park",
		"eventType": "SummerNav Evening",
		"registrationLocation": {
			lat: -36.903482,
			lng: 174.784422
		}
	};

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: myTestEvent.registrationLocation
	});

	var marker = new google.maps.Marker({
		position: myTestEvent.registrationLocation,
		map: map,
		title: myTestEvent.venue
	});
}
