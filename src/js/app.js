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
/* global $, ko, google,
	eventsJSON,
	getUTCDate,
	getTimeString,
	dateFormat,
	DEFAULT_MAP_CENTRE,
	DEFAULT_MAP_ZOOM,
	DEFAULT_ZOOM_MAX,
	MAP_INFOWINDOW_WIDTH_MAX,
	API_ATAPI_LOGO,
	API_ATAPI_WEBSITE,
	IMAGE_LOGO_AK_SUMMERNAV,
	IMAGE_LOGO_AK_CLUB : false
*/
/* global stripUrlHttp,
	createEventMarker,
	enableMapMarker,
	disableMapMarker,
	getDateString,
	getTime24String,
	resizeMap : false
*/
/* ======================================================= */
/* Globals */
/* ======================================================= */
// Google Maps
var map;
// infoWindow for Map pop up information
var infoWindow;
// Google Calendar Event
var gCalendarEvent;
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

		self.title = ko.pureComputed(function() {
			return self.series() + " - " + self.name();
		});

		self.dateShort = ko.pureComputed(function() {
			return dateFormat.formatDate(self.dateUTC(), 'D j M Y');
		});

		self.dateString = ko.pureComputed(function() {
			return $.datepicker.formatDate("DD d MM yy", self.dateUTC());
		});

		self.courseCloseString = ko.pureComputed(function() {
			return getTimeString(self.courseCloseUTC());
		});

		self.startWindowString = ko.pureComputed(function() {
			return getTimeString(self.startFirstUTC()) + " - " + getTimeString(self.startLastUTC());
		});

		self.websiteString = ko.pureComputed(function() {
			return stripUrlHttp(self.url());
		});

		self.imageEventSeries = ko.pureComputed(function() {
			if (self.series() == "Auckland SummerNav") {
				return IMAGE_LOGO_AK_SUMMERNAV;
			} else {
				return IMAGE_LOGO_AK_CLUB;
			}
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

		// Link to AT website with destination pre-entered
		// Note: Auckland Transport link does not use or appear to accept URL encoding
		self.aucklandTransportLink = ko.pureComputed(function() {
			var urlLink = "https://at.govt.nz/bus-train-ferry/journey-planner/#";
			var coordinates = self.registrationCoord().lat + "," + self.registrationCoord().lng;
			var searchValues = {
				"from": "",
				"fromLoc": "",
				"to": coordinates,
				"toLoc": coordinates,
				"timeMode": "B",
				"date": getDateString(self.startFirstUTC()),
				"time": getTime24String(self.startFirstUTC()),
				"modes": ["BUS", "TRAIN", "FERRY"],
				"transfers": "-1"
			};
			return urlLink + JSON.stringify(searchValues);
		});

		// Add link for Bus and Train planning
		self.aucklandTransportLinkOpen = function() {
			window.open(self.aucklandTransportLink());
		};

		self.data = data; //store imported raw data in oEvent for reference
		self.mapMarker = createEventMarker(self);
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
	self.loadingStatus = ko.observable(true);

	self.apiATMessage = ko.observable("");
	self.apiATLogo = ko.observable(API_ATAPI_LOGO);
	self.apiATWebsite = ko.observable(API_ATAPI_WEBSITE);
	self.apiATWebsiteString = ko.observable(stripUrlHttp(API_ATAPI_WEBSITE));
	self.apiATStations = ko.observableArray([]);

	self.displayLoadingWait = ko.pureComputed(function() {
		return self.loadingStatus() === true ? "loadingWaitDisplayed" : "loadingWaitHidden";
	}, self);

	// Google Calendar related observables
	self.gCalendarButtonHidden = ko.observable(false);
	self.displayGCalendarResult = ko.observable("");
	// Google Calendar reset between events
	self.gCalendarButtonReset = function() {
		self.gCalendarButtonHidden(false);
		self.displayGCalendarResult("");
	};

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

	// Selected Current Event observables and functions
	self.selectedEvent = ko.observable();
	self.selectedEventClose = function() {
		// Clear the selected event
		self.selectedEvent(null);
		// Clear all stations
		self.apiATStations([]);
		infoWindow.close();
	};
	self.eventNotSelected = ko.pureComputed(function() {
		return (typeof self.selectedEvent() === 'undefined' || self.selectedEvent() === null);
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
		self.selectedEventClose();
		resizeMap(newValue);
	});

	// Trigger resize of map when window size changes
	self.redrawMap = function() {
		resizeMap(self.filteredEvents());
	};
	window.addEventListener('resize', self.redrawMap);

	// Add eventList click to open marker and information
	self.eventListClick = function(currentEvent) {
		google.maps.event.trigger(currentEvent.mapMarker, 'click');
	};
};


/* ======================================================= */
/* initMap */
/* ======================================================= */

function onAPIMapLoadError(event) {
	var statusText = "Sorry, an error occurred while trying to load a required resource.\nPlease check internet connection and try again.";
	if (typeof(event) !== 'undefined') {
		statusText += "\nSource:\n" + event.target.src;
	}
	console.log(statusText);
	alert(statusText);

	// Map and call back to Knockout are not available
	// let user know not to keep waiting - Turn off wait display
	var loadingDiv = document.getElementById("neighbourhood-map-spinner");
	loadingDiv.innerHTML = "<h2>Unavailable.</h2><p>Failed to load required resources. Please check internet connection and try again.</p>";
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

	var myMapElement = document.getElementById("map-main");
	if (typeof myMapElement === "undefined") {
		var errorText = "Application Error: the <div id='map-main' class='map-main'> element to hold map was not found in html.";
		console.log(errorText);
		alert(errorText);
		return;
	}

	map = new google.maps.Map(myMapElement, mapOptions);

	infoWindow = new google.maps.InfoWindow({ maxWidth: MAP_INFOWINDOW_WIDTH_MAX });

	// Add Event Listener to close close event details when infoWindow closed
	google.maps.event.addListener(infoWindow, 'closeclick', function() {
		window.vm.selectedEventClose();
	});

	//set up access to update of loading display using knockout
	//reference: http://stackoverflow.com/a/9480044
	window.vm = new viewModel();
	ko.applyBindings(window.vm);

	window.vm.loadingStatus(false);
}
