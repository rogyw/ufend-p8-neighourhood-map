"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google, eventsJSON: false */

/* ======================================================= */
/* List */
/* ======================================================= */


/**
 * oEvent Model
 * @param  {object} data the orienteering Event JSON object.
 */
var oEvent = function(data) {
	var self = this;
	if (data !== null) {
		self.date = ko.observable(data.date);
		self.series = ko.observable(data.series);
		self.name = ko.observable(data.name);
		self.startFirst = ko.observable(data.startFirst);
		self.startLast = ko.observable(data.startLast);
		self.courseClose = ko.observable(data.courseClose);
		self.registrationCoord = ko.observable(data.registrationCoord);
		self.notes = ko.observable(data.notes);

		self.data = data; //store imported raw data in oEvent for reference
		self.mapMarker = createEventMarker(data);
	}
};


/**
 * Enables the Event Objects Map Marker to display on map
 * @param  {object} element Event Object
 */
function enableMapMarker(element) {
	element.mapMarker.setMap(map);
}


/**
 * Disables the visibility of Event Objects Map Marker. Note marker is not deleted.
 * @param  {object} element Event Object
 */
function disableMapMarker(element) {
	element.mapMarker.setMap(null);
}


/**
 * viewModel
 */
var viewModel = function() {

	//self represents the ViewModel this
	var self = this;

	self.eventsList = ko.observableArray();
	self.filter = ko.observable("");

	eventsJSON.forEach(function(eventItem) {
		self.eventsList.push(new oEvent(eventItem));
	});

	//filter the items using the filter text
	// Reference http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
	self.filteredEvents = ko.dependentObservable(function() {
		var filter = this.filter().toLowerCase();
		if (!filter) {
			//enable and return all the items
			this.eventsList().forEach(enableMapMarker);
			return this.eventsList();
		} else {
			return ko.utils.arrayFilter(this.eventsList(), function(event) {
				if (event.name().toLowerCase().search(filter) !== -1) {
					enableMapMarker(event);
					return true;
				} else {
					disableMapMarker(event);
					return false;
				}
			});
		}
	}, self);
};


/* ======================================================= */
/* Map
/* ======================================================= */

var map;


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
function createEventMarker(element) {

	var markerContent = getEventMarkerContent(element);
	var newMarker = new google.maps.Marker({
		position: element.registrationCoord,
		map: map,
		title: markerContent.title,
	});

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

	return newMarker;
}


/**
 * Repositions and resizes map view based on markers.
 */
function resizeMap() {

	//Start off with null LatLngBounds (i.e. reset)
	var bounds = new google.maps.LatLngBounds();

	//Add each of the currently visible mapMarkers to the bounds
	for (var i = 0, l = viewModel.filteredEvents().length; i < l; i++) {
		var position = viewModel.filteredEvents()[i].mapMarker.position;
		bounds.extend(position);
	}

	// center the map on the center of bounds
	map.setCenter(bounds.getCenter());

	// Zoom map to fit the new bounds
	map.fitBounds(bounds);
}


/**
 * Initialises the Map and places all Event Markers on Map
 * @return {boolean} Returns false on success, true if failure
 */
function initMap() {

	var mapOptions = {
		center: { lat: -36.9001229, lng: 174.7826388 },
		zoom: 12
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// Vanilla JS way to listen for resizing of the window
	// and adjust map bounds
	window.addEventListener('resize', resizeMap);

	ko.applyBindings(new viewModel());
}
