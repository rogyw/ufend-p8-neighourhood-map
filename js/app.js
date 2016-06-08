"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global $, ko, google, InfoBubble, eventsJSON, DateFormatter: false */

/* ======================================================= */
/* Constants */
/* ======================================================= */
// Note: currently using var instead of const for compatibilty
var DEFAULT_MAP_CENTRE = { lat: -36.9001229, lng: 174.7826388 };
var DEFAULT_MAP_ZOOM = 11;
var DEFAULT_ZOOM_MAX = 16;
var MAP_MARKER_ICON = "https://raw.githubusercontent.com/rogyw/ufend-p8-neighourhood-map/master/img/marker-o-flag.png";
var AJAX_API_TIMEOUT = 10000;
var API_ATAPI_STOP_DISTANCE = 1000;
var API_ATAPI_SECRET_KEY = "66ea2049-30bf-4ce3-bd6b-701e458de648";
var API_ATAPI_LOGO = "http://at-api.aucklandtransport.govt.nz/imageresizer/website/logo.png?width=55";
var API_ATAPI_WEBSITE = "https://at.govt.nz";
var MAX_BUSSTOPS = 8;
var IMAGE_LOGO_AK_SUMMERNAV = "http://www.orienteeringauckland.org.nz/assets/Uploads/Resource/Logos/logo-summernav-sml.png";

var DEBUG = true;

/* ======================================================= */
/* Global */
/* ======================================================= */

var map;
var infoBubble;
var infoBubbleTabCount = 0;
var dataATAPI;
var gCalendarEvent;


/* ======================================================= */
/* TODO */
/* ======================================================= */
// @TODO: Use Material Bottom Sheets for event information display when functionality added to Material Design Lite
//


/* ======================================================= */
/* Date Format Library */
/* ======================================================= */
var dateFormat = new DateFormatter();


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
		self.startFirstUTC = ko.observable(getUTCDate(data.startFirstUTC));
		self.startLastUTC = ko.observable(getUTCDate(data.startLastUTC));
		self.courseCloseUTC = ko.observable(getUTCDate(data.courseCloseUTC));
		self.registrationCoord = ko.observable(data.registrationCoord);
		self.notes = ko.observable(data.notes);

		self.title = ko.computed(function() {
			return self.series() + " - " + self.name();
		});


		self.dateShort = ko.computed(function() {
			return dateFormat.formatDate(self.dateUTC(), 'D j M Y');
		});

		self.infoBubbleContent = ko.computed(function() {

			var dateString = $.datepicker.formatDate("DD d MM yy", self.dateUTC());
			var startFirstString = getTimeString(self.startFirstUTC());
			var startLastString = getTimeString(self.startLastUTC());
			var courseCloseText = getTimeString(self.courseCloseUTC());

			var infoContent = "";
			if (self.series() == "Auckland SummerNav") {
				infoContent += "<img class=\"img-summernav\" src=\"" + IMAGE_LOGO_AK_SUMMERNAV + "\" alt=\"Auckland SummerNav\">";
			}
			infoContent += "<h3>" + dateString + "</h3>";
			infoContent += "<h4>" + self.name() + "</h4>";
			infoContent += "<ul>";
			infoContent += "<li><h5>Event Series:</h5> <span class=\"detail\"><strong>" + self.series() + "</strong></span></li>";
			infoContent += "<li><h5>Start Anytime Between:</h5> <span class=\"detail\">" + startFirstString + " - " + startLastString + "</span></li>";
			infoContent += "<li><h5>Course Closure:</h5> <span class=\"detail\">" + courseCloseText + "</span></li>";
			if (self.notes() !== "") {
				infoContent += "<li><h5>Notes:</h5> <span class=\"notes\">" + self.notes() + "</span></li>";
			}
			infoContent += "<li class=\"notice\">Please check onsite noticeboard for updates</li>";
			infoContent += "<li class=\"g-calendar-button\"><button name=\"button-g-calendar-add\" onclick = \"gCalendarHandleAuthClick()\">Add Event to Google Calendar</button>";
			infoContent += "</ul>";

			return infoContent;
		});

		self.gCalendarEvent = ko.computed(function() {
			var description = "";
			var startFirstString = getTimeString(self.startFirstUTC());
			var startLastString = getTimeString(self.startLastUTC());
			var courseCloseText = getTimeString(self.courseCloseUTC());

			description += "Start any time between " + startFirstString + " and " + startLastString + ". ";
			description += "Course Closure is usually " + courseCloseText + ". ";
			if (self.notes() !== "") {
				description += "Notes: " + self.notes() + ". ";
			}
			description += "Please always check onsite noticeboard for updates and notices.";
			description += "Further information available at: http://auckoc.org.nz/";

			var myEvent = {
				'summary': self.title() + "- Orienteering " + self.series(),
				'location': self.registrationCoord().lat + ", " + self.registrationCoord().lng,
				'description': description,
				'start': {
					'dateTime': self.startFirstUTC(),
					'timeZone': 'Pacific/Auckland'
				},
				'end': {
					'dateTime': self.courseCloseUTC(),
					'timeZone': 'Pacific/Auckland'
				},
				'reminders': {
					'useDefault': false,
					'overrides': [{
						'method': 'email',
						'minutes': 24 * 60
					}, {
						'method': 'popup',
						'minutes': 10
					}]
				}
			};
			return myEvent;
		});

		self.data = data; //store imported raw data in oEvent for reference
		self.mapMarker = createEventMarker(self.registrationCoord(), self.title(), self.infoBubbleContent(), self.gCalendarEvent());
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
		var filteredList;

		if (!filter) {
			//no search term so reset all as viewable and return all the items
			this.eventsList().forEach(enableMapMarker);
			filteredList = this.eventsList();
		} else {
			//filter all events based on search term and update visibilty before returning matching subset
			filteredList = ko.utils.arrayFilter(this.eventsList(), function(event) {
				if ((event.name().toLowerCase().search(filter) !== -1) || (event.dateShort().toLowerCase().search(filter) !== -1)) {
					enableMapMarker(event);
					return true;
				} else {
					disableMapMarker(event);
					return false;
				}
			});
		}

		return filteredList.sort(function(a, b) {
			return ((a.dateUTC() < b.dateUTC()) ? -1 : (a.dateUTC() > b.dateUTC()) ? 1 : 0);
		});
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
function createEventMarker(coordinates, title, eventInfo, gCalEvent) {

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

		if (infoBubble === undefined) {
			infoBubble = new InfoBubble({
				maxWidth: 250
			});
		}

		if (infoBubble) {
			//Delete all tabs in infoBubble
			for (var i = infoBubbleTabCount; i > 0; i--) {
				infoBubble.removeTab(i - 1);
				if (DEBUG) { console.log("Removing infoBubble Tab: " + i); }
			}
			infoBubbleTabCount = 0;
			infoBubble.close();
		}


		infoBubble.open(map, newMarker);
		requestRoutes(coordinates);

		gCalendarEvent = gCalEvent;
		if (DEBUG) {
			console.log("gCalendar Event =");
			console.log(gCalendarEvent);
		}
		var tabs = [];

		var tabContent = "<div class=\"map-info\">";
		tabContent += eventInfo;
		tabContent += "</div>";

		tabs.push({
			"tabName": "Event Details",
			"content": tabContent
		});

		infoBubble.addTab(tabs[0].tabName, tabs[0].content);
		infoBubbleTabCount += 1; //increase tab counter

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

/* ======================================================= */
/* Date/Time Functions*/
/* ======================================================= */

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

	//Apply Fix to set time to UTC reference: http://stackoverflow.com/a/439871
	var dateValue = new Date(Date.UTC(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1]));

	return dateValue;
}

function getTimeString(value) {

	//Requires: https://github.com/kartik-v/php-date-formatter
	var result = dateFormat.formatDate(value, 'g:ia');

	return result;
}

/* ======================================================= */
/* Third Party API - Auckland Transport
/* ======================================================= */

function requestRoutes(coordinates, datetime) {
	var request = $.ajax({
		url: "http://api.at.govt.nz/v1/gtfs/stops/geosearch?lat=" + coordinates.lat + "&lng=" + coordinates.lng + "&distance=" + API_ATAPI_STOP_DISTANCE + "&api_key=" + API_ATAPI_SECRET_KEY,
		type: "GET",
		dataType: "jsonp",
		timeout: AJAX_API_TIMEOUT,
	});
	request.done(function(data) {
		if (DEBUG) {
			console.log("AT API success.");
			console.log(data);
		}
		dataATAPI = data;
		var resultsCount = dataATAPI.response.length;
		var tabContent = "<div class=\"map-info\">";
		tabContent += "<h3>Bus &amp; Train Stops Nearby</h3>";
		if (resultsCount < 1) {
			tabContent += "<p>No public transport stops found within " + API_ATAPI_STOP_DISTANCE + " metres of registration location. Please click link below for alternate details.</p>";
		} else {
			tabContent += "<ul class=\"busstops\">";
			tabContent += "<li><span class=\"busstops-code\">Stop #</span><span class=\"busstops-address\">Address</span> <span class=\"busstops-distance\">Distance</span>";
			for (var i = 1;
				((i < dataATAPI.response.length) && (i < MAX_BUSSTOPS + 1)); i++) {
				tabContent += "<li>";
				tabContent += "<span class=\"busstops-code\">" + dataATAPI.response[i].stop_code + "</span><span class=\"busstops-address\">" + dataATAPI.response[i].stop_name + "</span> <span class=\"busstops-distance\">(" + parseInt(dataATAPI.response[i].st_distance_sphere, 10) + "m)</span>";
				tabContent += "</li>";
			}
			tabContent += "</ul>";

			tabContent += "<p><a href=\"https://at.govt.nz/bus-train-ferry/journey-planner/\" target=\"_blank\">Plan Your Trip</a></p>";
			tabContent += "<div class=\"api-provider\">";
			tabContent += "<p><a href=\"" + API_ATAPI_WEBSITE + "\" target=\"_blank\"><img alt=\"AT\" src=\"" + API_ATAPI_LOGO + "\"></a>";
			tabContent += "Data provided by: <a href=\"" + API_ATAPI_WEBSITE + "\" target=\"_blank\">at.govt.nz</a></p>";

			tabContent += "</div>";
		}
		tabContent += "</div>";

		infoBubble.addTab("Bus/Train", tabContent);
		infoBubbleTabCount += 1; //increase tabCounter by 1
	});

	request.fail(function(xhr, err) {
		alert("Sorry, we experienced a problem with the Auckland Transport API. Bus/Train information is temporarily unavailable. Error: " + err);
		if (DEBUG) {
			console.log("AT API call failure:");
			console.log(err);
		}
	});
}
