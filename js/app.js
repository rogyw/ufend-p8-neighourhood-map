"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global $, ko, google, InfoBubble, eventsJSON: false */

/* ======================================================= */
/* Constants */
/* ======================================================= */
// Note: currently using var instead of const for compatibilty
var DEFAULT_MAP_CENTRE = { lat: -36.9001229, lng: 174.7826388 };
var DEFAULT_MAP_ZOOM = 11;
var DEFAULT_ZOOM_MAX = 16;
var MAP_MARKER_ICON = "https://raw.githubusercontent.com/rogyw/ufend-p8-neighourhood-map/master/img/marker-o-flag.png";
var API_ATAPI_STOP_DISTANCE = 1000;
var API_ATAPI_SECRET_KEY = "66ea2049-30bf-4ce3-bd6b-701e458de648";
var API_ATAPI_LOGO = "http://at-api.aucklandtransport.govt.nz/imageresizer/website/logo.png?width=55";
var API_ATAPI_WEBSITE = "https://at.govt.nz";
var MAX_BUSSTOPS = 5;
var IMAGE_LOGO_AK_SUMMERNAV = "http://www.orienteeringauckland.org.nz/assets/Uploads/Resource/Logos/logo-summernav-sml.png";
/* ======================================================= */
/* Global */
/* ======================================================= */

var map;
var infoBubble;
var dataATAPI;

/* ======================================================= */
/* TODO */
/* ======================================================= */
// @TODO: Use Material Bottom Sheets for event information display when functionality added to Material Design Lite
//



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
		self.dateUTC = ko.observable(getUTCDate(data.dateUTC));
		self.series = ko.observable(data.series);
		self.name = ko.observable(data.name);
		self.startFirst = ko.observable(data.startFirst);
		self.startLast = ko.observable(data.startLast);
		self.courseClose = ko.observable(data.courseClose);
		self.registrationCoord = ko.observable(data.registrationCoord);
		self.notes = ko.observable(data.notes);

		self.title = ko.computed(function() {
			return self.series() + " - " + self.name();
		});


		self.infoBubbleContent = ko.computed(function() {

			var dateString = $.datepicker.formatDate("DD d MM yy", self.dateUTC());

			var infoContent = "";
			if (self.series() == "Auckland SummerNav") {
				infoContent += "<img class=\"img-summernav\" src=\"" + IMAGE_LOGO_AK_SUMMERNAV + "\" alt=\"Auckland SummerNav\">";
			}
			infoContent += "<h3>" + self.name() + "</h3>";
			infoContent += "<h4>" + dateString + "</h4>";
			infoContent += "<ul>";
			infoContent += "<li><h5>Event Series:</h5> <span class=\"detail\"><strong>" + self.series() + "</strong></span></li>";
			infoContent += "<li><h5>Start Anytime Between:</h5> <span class=\"detail\">" + self.startFirst() + " - " + self.startLast() + "</span></li>";
			infoContent += "<li><h5>Course Closure:</h5> <span class=\"detail\">" + self.courseClose() + "</span></li>";
			if (self.notes() !== "") {
				infoContent += "<li><h5>Note:</h5> <span class=\"detail\">" + self.notes() + "</span></li>";
			}
			infoContent += "<li class=\"notice\">Please check onsite noticeboard for updates</li>";
			infoContent += "</ul>";
			return infoContent;
		});

		self.data = data; //store imported raw data in oEvent for reference
		self.mapMarker = createEventMarker(self.registrationCoord(), self.title(), self.infoBubbleContent());
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

	//Sort the JSON events data to place markers on map in reverse chronological order.
	//Reference: Based on http://stackoverflow.com/a/8900824
	eventsJSON.sort(function(a, b) {
		//reverse chronological order
		return ((a.dateUTC > b.dateUTC) ? -1 : (a.dateUTC < b.dateUTC) ? 1 : 0);
	});

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
function createEventMarker(coordinates, title, eventInfo) {

	var newMarker = new google.maps.Marker({
		position: coordinates,
		map: map,
		title: title,
		icon: MAP_MARKER_ICON
	});

	//Make the Marker visible on the map
	newMarker.setMap(map);

	//add Listener to ensure Information Window is opened when Marker clicked
	// Note: uses global infoBubble to enable closing of any previous open info Window
	// reference: http://stackoverflow.com/a/4540249
	google.maps.event.addListener(newMarker, 'click', function() {

		newMarker.setAnimation(google.maps.Animation.BOUNCE);
		var timeoutID = window.setTimeout(function() { newMarker.setAnimation(null); }, 2100);

		if (infoBubble) {
			infoBubble.close();
		}
		infoBubble = new InfoBubble({
			maxWidth: 250
		});
		infoBubble.open(map, newMarker);
		requestRoutes(coordinates);

		var tabs = [];

		var tabContent = "<div class=\"map-info\">";
		tabContent += eventInfo;
		tabContent += "</div>";

		tabs.push({
			"tabName": "Event Details",
			"content": tabContent
		});

		infoBubble.addTab(tabs[0].tabName, tabs[0].content);

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

	//Close infoBubble on all Map resize events
	if (infoBubble) {
		infoBubble.close();
	}

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

/**
 * Converts a date in YY-MM-DD HH:MM to a date object
 * Reference: Based on http://stackoverflow.com/a/22835394
 * @param  {[type]} ymdString [description]
 * @return {[type]}           [description]
 */
function getUTCDate(ymdString) {

	//Split "YYYY-MM-DD" UTC string
	var dateTime = ymdString.split(' ');
	var dateParts = dateTime[0].split('-');
	var timeParts = dateTime[1].split(':');

	//adjust month representation for javascript (0=Jan - 11=Dec)
	dateParts[1] = dateParts[1] - 1;

	var dateValue = new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1]);

	return dateValue;
}

/* ======================================================= */
/* Third Party API
/* ======================================================= */

function requestRoutes(coordinates) {
	$.ajax({
			url: "http://api.at.govt.nz/v1/gtfs/stops/geosearch?lat=" + coordinates.lat + "&lng=" + coordinates.lng + "&distance=" + API_ATAPI_STOP_DISTANCE + "&api_key=" + API_ATAPI_SECRET_KEY,
			type: "GET",
			dataType: "jsonp",
		})
		.done(function(data) {
			console.log("AT API success.");
			dataATAPI = data;
			console.log(dataATAPI);
			var resultsCount = dataATAPI.response.length;
			var tabContent = "<div class=\"map-info\">";
			tabContent += "<h3>Bus &amp; Train Stops Nearby</h3>";
			if (resultsCount < 1) {
				tabContent += "<p>No public transport stops found within " + API_ATAPI_STOP_DISTANCE + " metres of registration location. Please click link below for alternate details.</p>";
			} else {
				tabContent += "<ul>";
				for (var i = 1;
					((i < dataATAPI.response.length) && (i < MAX_BUSSTOPS + 1)); i++) {
					tabContent += "<li>";
					tabContent += dataATAPI.response[i].stop_code + " - " + dataATAPI.response[i].stop_name + " (" + parseInt(dataATAPI.response[i].st_distance_sphere, 10) + "m)";
					tabContent += "</li>";
				}
				tabContent += "</ul>";

				tabContent += "<div class=\"api-provider\">";
				tabContent += "<p><a href=\"" + API_ATAPI_WEBSITE + "\" target=\"_blank\"><img alt=\"AT\" src=\"" + API_ATAPI_LOGO + "\"></a>";
				tabContent += "Data provided by: <a href=\"" + API_ATAPI_WEBSITE + "\" target=\"_blank\">at.govt.nz</a></p>";

				tabContent += "</div>";

			}
			tabContent += "</div>";

			infoBubble.addTab("Bus/Train", tabContent);
		})
		.fail(function(data) {
			console.log("AT API failure.");
			alert("Error: Auckland Transport API failure.");
			dataATAPI = data;
			console.log(dataATAPI);
		});
}
