"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google: false */

var map;
var markers = [];


function createEventMarker(element, index, array) {

	var bounds = window.mapBounds; // current boundaries of the map window
	var title = element.series + " - " + element.name;
	var newMarker = new google.maps.Marker({
		position: element.registrationCoord,
		map: map,
		title: title,
	});
	markers.push(newMarker);
	newMarker.setMap(map);

	//change the look of the content in the map infoWindow.
	var infoContent = '<div class="map-info">';
	infoContent += "<h3>" + title + "</h3>";
	infoContent += "<ul>";
	infoContent += "<li>Date: " + element.date + "</li>";
	infoContent += "<li>Start between: " + element.startFirst + " - " + element.startLast + "</li>";
	infoContent += "<li>Course closure Time (Check notice board): " + element.courseClose + "</li>";
	if (element.notes !== "") {
		infoContent += "<li>Note: " + element.notes + "</li>";
	}
	infoContent += "</ul></div>";

	// infoWindows are the little helper windows that open when you click
	// or hover over a pin on a map. They usually contain more information
	// about a location.
	var infoWindow = new google.maps.InfoWindow({
		content: infoContent
	});

	// open Information Window when Marker clicked
	google.maps.event.addListener(newMarker, 'click', function() {
		infoWindow.open(map, newMarker);
	});

	bounds.extend(new google.maps.LatLng(element.registrationCoord.lat, element.registrationCoord.lng));
	// fit the map to the new marker
	map.fitBounds(bounds);
	// center the map
	map.setCenter(bounds.getCenter());
}


function initMap() {

	var myLatlng = new google.maps.LatLng(-36.903482, 174.784422);

	var mapOptions = {
		disableDefaultUI: true,
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	window.mapBounds = new google.maps.LatLngBounds();

	eventsJSON.forEach(createEventMarker);

}
