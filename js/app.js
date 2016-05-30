"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, google, eventsJSON: false */

/* ======================================================= */
/* Constants */
/* ======================================================= */
// Note: currently using var instead of const for compatibilty
var DEFAULT_MAP_CENTRE = { lat: -36.9001229, lng: 174.7826388 };
var DEFAULT_MAP_ZOOM = 11;
var DEFAULT_ZOOM_MAX = 16;

/* ======================================================= */
/* Global */
/* ======================================================= */

var map;
var infoWindow;

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

		self.title = ko.computed(function() {
			return self.series + " - " + self.name;
		});

		self.infoWindowContent = ko.computed(function() {
			var infoContent = '<div class="map-info">';
			infoContent += "<h3>" + self.name + "</h3>";
			infoContent += "<h4>" + self.series + "</h4>";
			infoContent += "<ul>";
			infoContent += "<li><strong>Date: " + self.date + "</strong></li>";
			infoContent += "<li>Start between: " + self.startFirst + " - " + self.startLast + "</li>";
			infoContent += "<li>Course closure Time (Check notice board): " + self.courseClose + "</li>";
			if (self.notes !== "") {
				infoContent += "<li>Note: " + self.notes + "</li>";
			}
			infoContent += "</ul></div>";
			return infoContent;
		});

		self.data = data; //store imported raw data in oEvent for reference
		self.mapMarker = createEventMarker(self.registrationCoord(), data.series + " - " + data.name);
	}
};


/**
 * viewModel
 */
var viewModel = function() {

	//self represents the viewModel this
	var self = this;

	self.eventsList = ko.observableArray();
	self.filter = ko.observable("");

	//Import the JSON events data into eventsList
	eventsJSON.forEach(function(eventItem) {
		self.eventsList.push(new oEvent(eventItem));
	});

	//filter the items using the filter text
	// Reference http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
	self.filteredEvents = ko.computed(function() {

		// get the filter search text and ignore case
		var filter = this.filter().toLowerCase();

		if (!filter) {
			//no search term so reset all as viewable and return all the items
			this.eventsList().forEach(enableMapMarker);
			return this.eventsList();
		} else {
			//filter all events based on search term and update visibilty before returning matching subset
			var filteredList = ko.utils.arrayFilter(this.eventsList(), function(event) {
				if (event.name().toLowerCase().search(filter) !== -1) {
					enableMapMarker(event);
					return true;
				} else {
					disableMapMarker(event);
					return false;
				}
			});
			return filteredList;
		}
	}, self);

	// Trigger resize of map when the filteredEvents changes
	self.filteredEvents.subscribe(function(newValue) {
		resizeMap(newValue);
	});

	// Trigger resize of map when window size changes
	self.redrawMap = function() {
		resizeMap(self.filteredEvents());
	};
	window.addEventListener('resize', self.redrawMap);

	//Add eventList Click open marker info window
	self.eventListClick = function(currentEvent) {
		google.maps.event.trigger(currentEvent.mapMarker, 'click');
	};

};


/* ======================================================= */
/* Map
/* ======================================================= */

/**
 * Creates a google map marker.
 * @param  {object} coordinates JSON object containing location
 * @param  {string} title The Title to be applied on the marker
 * @return {object}  Returns created Google Map Marker Object
 */
function createEventMarker(coordinates, title) {

	var newMarker = new google.maps.Marker({
		position: coordinates,
		map: map,
		title: title,
	});

	//Make the Marker visible on the map
	newMarker.setMap(map);

	//add Listener to ensure Information Window is opened when Marker clicked
	// Note: uses global infoWindow to enable closing of any previous open info Window
	// reference: http://stackoverflow.com/a/4540249
	google.maps.event.addListener(newMarker, 'click', function() {

		newMarker.setAnimation(google.maps.Animation.BOUNCE);
		var timeoutID = window.setTimeout(function() { newMarker.setAnimation(null) }, 2100);

		if (infoWindow) {
			infoWindow.close();
		}
		infoWindow = new google.maps.InfoWindow({ content: title });
		infoWindow.open(map, newMarker);
	});

	return newMarker;
}


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
 * Repositions and resizes map view based on eventList markers.
 */
function resizeMap(eventList) {

	var count = eventList.length;

	// Zoom map to fit the new bounds
	if (count < 1) {
		//No locations or error so Zoom out on map
		map.setZoom(DEFAULT_MAP_ZOOM);
		map.setCenter(DEFAULT_MAP_CENTRE);
	} else {
		//Start off with null LatLngBounds (i.e. reset)
		var bounds = new google.maps.LatLngBounds();

		//Add each of the currently visible mapMarkers to the bounds
		for (var i = 0; i < count; i++) {
			var position = eventList[i].mapMarker.position;
			bounds.extend(position);
		}

		// center the map on the center of bounds
		map.setCenter(bounds.getCenter());
		map.fitBounds(bounds);
	}
}


/**
 * Initialises the Map and places all Event Markers on Map
 * @return {boolean} Returns false on success, true if failure
 */
function initMap() {

	var mapOptions = {
		center: DEFAULT_MAP_CENTRE,
		zoom: DEFAULT_MAP_ZOOM,
		maxZoom: DEFAULT_ZOOM_MAX
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	ko.applyBindings(new viewModel());
}
