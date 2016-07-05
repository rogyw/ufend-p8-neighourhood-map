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
/* global getUTCDate, getTimeString, dateFormat :false */


/* ======================================================= */
/* Globals */
/* ======================================================= */
// Google Maps
var map;
// InfoBubble for Map pop up information Windows
var infoBubble;
var infoBubbleTabCount = 0;

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

		self.dateString = ko.computed(function() {
			return $.datepicker.formatDate("DD d MM yy", self.dateUTC());
		});

		self.courseCloseString = ko.computed(function() {
			return getTimeString(self.courseCloseUTC());
		});

		self.startWindowString = ko.computed(function() {
			return getTimeString(self.startFirstUTC()) + " - " + getTimeString(self.startLastUTC());
		});

		self.websiteString = ko.computed(function() {
			return stripUrlHttp(self.url());
		});

		self.imageEventSeries = ko.computed(function() {
			if (self.series() == "Auckland SummerNav") {
				return IMAGE_LOGO_AK_SUMMERNAV;
			} else {
				return IMAGE_LOGO_AK_CLUB;
			}
		});

		self.infoBubbleContent = ko.computed(function() {
			var infoContent = "";
			infoContent += "<div class=\"img-holder\">";
			if (self.series() == "Auckland SummerNav") {
				infoContent += "<img class=\"img-summernav\" src=\"" + IMAGE_LOGO_AK_SUMMERNAV + "\" alt=\"Auckland SummerNav\">";
			} else {
				infoContent += "<img class=\"img-summernav\" src=\"" + IMAGE_LOGO_AK_CLUB + "\" alt=\"Auckland Orienteers\">";
			}
			infoContent += "</div>";
			infoContent += "<h3>" + self.dateString() + "</h3>";
			infoContent += "<h4>" + self.name() + "</h4>";
			infoContent += "<ul>";
			infoContent += "<li><h5>Event Series:</h5> <span class=\"detail\"><strong>" + self.series() + "</strong></span></li>";
			infoContent += "<li><h5>Start Anytime Between:</h5> <span class=\"detail\">" + self.startWindowString() + "</span></li>";
			infoContent += "<li><h5>Course Closure:</h5> <span class=\"detail\">" + self.courseCloseString() + "</span></li>";
			if (self.notes() !== "") {
				infoContent += "<li><h5>Notes:</h5> <span class=\"notes\">" + self.notes() + "</span></li>";
			}
			infoContent += "<li><h5>Website:</h5><span class=\"detail\"><a href=\"" + self.url() + "\" target=\"_blank\">" + self.websiteString() + "</a></span></li>";
			infoContent += "<li class=\"notice\">Note: These details are tentative and subject to change,</li>";
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
		self.mapMarker = createEventMarker(self);

		self.transportStations = ko.observableArray();
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
	self.apiMessage= ko.observable();

	self.displayLoadingWait = ko.computed(function() {
		return self.loadingStatus() === true ? "loadingWaitDisplayed" : "loadingWaitHidden";
	}, self);

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

	self.selectedEvent = ko.observable();

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

	infoBubble = new InfoBubble({ maxWidth: MAP_INFOBUBBLE_WIDTH_MAX });

	var tabs = [];
	//var tabContent = "<div class=\"map-info\" data-bind=\"template: { name: 'event-information-template' }\" ></div>";
	var tabContent = '<p>Hello<p><div class="map-info" data-bind="template: { name: "event-information-template", data: selectedEvent }"></div>';


	tabs.push({
		"tabName": "Event Details",
		"content": tabContent
	});

	infoBubble.addTab(tabs[0].tabName, tabs[0].content);
	infoBubbleTabCount += 1; //increase tab counter

	google.maps.event.addListener(map, 'click', function() {
		alert('TODO something');
    });

	//set up access to update of loading display using knockout
	//reference: http://stackoverflow.com/a/9480044
	window.vm = new viewModel();
	ko.applyBindings(window.vm);

	window.vm.loadingStatus(false);
}
