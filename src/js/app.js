/*
 * =======================================================
 * app.js
 *  - contains core application for
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */

"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global $, ko, google, eventsJSON: false */
/* prereq: config.js */
/* global DEBUG, getUTCDate, getTimeString, dateFormat :false */


/* ======================================================= */
/* Globals */
/* ======================================================= */
// Google Maps
var map;


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
		self.url = ko.observable(data.url);

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
			infoContent += "<li><h5>Website:</h5><span class=\"detail\"><a href=\"" + self.url() + "\" target=\"_blank\">" + self.url() + "</a></span></li>";
			infoContent += "<li class=\"notice\">Please check onsite noticeboard for updates</li>";
			infoContent += "<li class=\"g-calendar-button\"><button name=\"button-g-calendar-add\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick = \"gCalendarHandleAuthClick()\">Add Event to Google Calendar</button>";
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
/* initMap */
/* ======================================================= */

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

	var myMapElement = document.getElementById("map-main");
	if (typeof myMapElement === "undefined") {
		var errorText = "Application Error: the <div id='map-main' class='map-main'> element to hold map was not found in html.";
		console.log(errorText);
		alert(errorText);
		return;
	}

	map = new google.maps.Map(myMapElement, mapOptions);

	//turn off loading display
	var loadingDiv = document.getElementById("neighbourhood-map-spinner");
	loadingDiv.style.display = "none";

	ko.applyBindings(new viewModel());
}
