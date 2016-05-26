"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google: false */



/* ======================================================= */
/* Map
/* ======================================================= */

var map;
var markers = [];


/**
 * creates an object containing Title and Content for a marker based on provided data object
 * @param  {object} data JSON data object containing event information
 * @return {object} Object containing Title and HTML for Marker Content
 */
function getEventMarkerContent(data) {

	var markerContent = {};
	var infoContent;

	// Build the Event Title
	markerContent.title = data.series + " - " + data.name;

	//Build the marker pop up window content
	infoContent = '<div class="map-info">';
	infoContent += "<h3>" + data.name + "</h3>";
	infoContent += "<h4>" + data.series + "</h4>";
	infoContent += "<ul>";
	infoContent += "<li><strong>Date: " + data.date + "</strong></li>";
	infoContent += "<li>Start between: " + data.startFirst + " - " + data.startLast + "</li>";
	infoContent += "<li>Course closure Time (Check notice board): " + data.courseClose + "</li>";
	if (data.notes !== "") {
		infoContent += "<li>Note: " + data.notes + "</li>";
	}
	infoContent += "</ul></div>";
	markerContent.infoContent = infoContent;

	return markerContent;
}


/**
 * Function to run within a ForEach on Event Marker List. Create an event marker based on each element within the array.
 * @param  {object} element JSON object containing event data
 * @param  {integer} index   current index of array (optional)
 * @param  {[type]} array   event Array (optional)
 * @return {boolean}  Returns false on success, true if failure
 */
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

	// fit the map to the new marker
	bounds.extend(new google.maps.LatLng(element.registrationCoord.lat, element.registrationCoord.lng));
	map.fitBounds(bounds);
	// center the map
	map.setCenter(bounds.getCenter());

	return false;
}


/**
 * Repositions and resizes map view based on map bounds.
 */
function resizeMap() {
	//Make sure the map bounds get updated on page resize
	map.fitBounds(window.mapBounds);
}


/**
 * Initialises the Map and places all Event Markers on Map
 * @return {boolean} Returns false on success, true if failure
 */
function initMap() {

	var mapOptions = {
		disableDefaultUI: true,
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	window.mapBounds = new google.maps.LatLngBounds();

	eventsJSON.forEach(createEventMarker);

	// Vanilla JS way to listen for resizing of the window
	// and adjust map bounds
	window.addEventListener('resize', resizeMap);

	return false;
}
