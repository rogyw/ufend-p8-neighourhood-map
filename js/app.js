"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google: false */

var map;
var markers = [];


function createEventMarker(element, index, array) {
	var newMarker = new google.maps.Marker({
		position: element.registrationCoord,
		map: map,
		title: element.series + " - " + element.name,
	});
	markers.push(newMarker);
	newMarker.setMap(map);
}


function initMap() {

	var myLatlng = new google.maps.LatLng(-36.903482, 174.784422);

	var mapOptions = {
		disableDefaultUI: true,
		zoom: 12,
		center: myLatlng
	}

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	eventsJSON.forEach(createEventMarker);
	window.mapBounds = new google.maps.LatLngBounds();
}
