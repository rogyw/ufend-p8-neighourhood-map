"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google: false */

var map;
var markers = [];

function getEventMarkerContent(data){
	var markerContent = {};
	var infoContent;

	markerContent.title = data.series + " - " + data.name;

	//Build the markers pop up window content
	infoContent = '<div class="map-info">';
	infoContent += "<h3>" + markerContent.title + "</h3>";
	infoContent += "<ul>";
	infoContent += "<li>Date: " + data.date + "</li>";
	infoContent += "<li>Start between: " + data.startFirst + " - " + data.startLast + "</li>";
	infoContent += "<li>Course closure Time (Check notice board): " + data.courseClose + "</li>";
	if (data.notes !== "") {
		infoContent += "<li>Note: " + data.notes + "</li>";
	}
	infoContent += "</ul></div>";

	markerContent.infoContent = infoContent;
	return markerContent;
}


function createEventMarker(element, index, array) {

	var bounds = window.mapBounds; // current boundaries of the map window
	var markerContent = getEventMarkerContent(element);

	var newMarker = new google.maps.Marker({
		position: element.registrationCoord,
		map: map,
		title: markerContent.title,
	});
	markers.push(newMarker);
	newMarker.setMap(map);


	// infoWindows are the little helper windows that open when you click
	// or hover over a pin on a map. They usually contain more information
	// about a location.
	var infoWindow = new google.maps.InfoWindow({
		content: markerContent.infoContent
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

	var mapOptions = {
		disableDefaultUI: true,
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	window.mapBounds = new google.maps.LatLngBounds();

	eventsJSON.forEach(createEventMarker);
}
