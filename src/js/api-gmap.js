/*
 * =======================================================
 * app-map.js
 *  - contains core map functions for
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */
"use strict";

/* ======================================================= */
/* jsHint configuration */
/* ======================================================= */
// set jshint to ignore console, alert, etc
/* jshint devel : true */
// set jshint to expect external global changable variables
/* global map: true */
// set jshint Functions
/* global requestRoutes: false */
// set jshint to expect external CONSTANTS
/* global google,
	DEFAULT_MAP_CENTRE,
	DEFAULT_MAP_ZOOM,
	MAP_MARKER_ICON,
	MAP_MARKER_HIDE_ONLY,
	infoWindow :false
*/
/* global gCalendarEvent :true */


/* ======================================================= */
/* Google Map */
/* ======================================================= */
/**
 * Creates a google map marker.
 * @param  {object} coordinates JSON object containing location
 * @param  {string} title The Title to be applied on the marker
 * @return {object}  Returns created Google Map Marker Object
 */
function createEventMarker(oEvent) {

	var coordinates = oEvent.registrationCoord();
	var title = oEvent.title();

	var newMarker = new google.maps.Marker({
		position: coordinates,
		map: map,
		title: title,
		icon: MAP_MARKER_ICON
	});

	//Make the Marker visible on the map
	newMarker.setMap(map);

	//add Listener to ensure Information is displayed when Marker clicked
	// Note: uses global infoWindow to enable closing of any previous open info Window
	// reference: http://stackoverflow.com/a/4540249
	google.maps.event.addListener(newMarker, 'click', function() {

		window.vm.selectedEvent(oEvent);

		newMarker.setAnimation(google.maps.Animation.BOUNCE);
		var timeoutID = window.setTimeout(function() { newMarker.setAnimation(null); }, 2100);

		if (infoWindow) {
			infoWindow.close();
		}

		var content = "<div class=\"event-info-window\"><p class=\"date\"> " + oEvent.dateShort() + " </p><p class=\"name\">" + oEvent.name() + "</p></div>";
		infoWindow.setContent(content);
		infoWindow.open(map, newMarker);
		// Save gCalendar event for event to global value
		gCalendarEvent = oEvent.gCalendarEvent();
		// Get API AT bus stop values
		requestRoutes(coordinates);
	});
	return newMarker;
}


/**
 * Enables the Event Objects Map Marker to display on map
 * @param  {object} element Event Object
 */
function enableMapMarker(element) {
	if (MAP_MARKER_HIDE_ONLY === true) {
		element.mapMarker.setVisible(true);
	} else {
		element.mapMarker.setMap(map);
	}

}


/**
 * Disables the visibility of Event Objects Map Marker. Note marker is not deleted.
 * @param  {object} element Event Object
 */
function disableMapMarker(element) {
	if (MAP_MARKER_HIDE_ONLY === true) {
		element.mapMarker.setVisible(false);
	} else {
		element.mapMarker.setMap(null);
	}
}


/**
 * Repositions and resizes map view based on eventList markers.
 */
function resizeMap(eventList) {

	var count = eventList.length;

	//Close infoWindow on all Map resize events
	if (infoWindow) {
		infoWindow.close();
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
