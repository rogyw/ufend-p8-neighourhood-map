/*
 * =======================================================
 * api-gcalendar.js
 *  - contains google calendar api related code for
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 *
 * Code Reference: Based on
 * https://developers.google.com/google-apps/calendar/quickstart/js
 * =======================================================
 */

'use strict';

// set jshint to ignore console, alert, etc
/* jshint devel : true */
// set jshint to ignore external globals
/* global gCalendarEvent, gapi, DEBUG : false */

/* ======================================================= */
/* Constants*/
/* ======================================================= */
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var GCALENDAR_CLIENT_ID = '1035036075694-1eocpmula50dhlu5t8cmealdhhj70t6b.apps.googleusercontent.com';
//Read/Write Google Calendar Scope required to insert events
var GCALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];


/**
 * Check if current user has authorized this application.
 */
function gCalendarCheckAuth() {
	gapi.auth.authorize({
		client_id: GCALENDAR_CLIENT_ID,
		scope: GCALENDAR_SCOPES.join(' '),
		immediate: true
	}, gCalendarHandleAuthResult);
}


/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function gCalendarHandleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		window.vm.gCalendarButtonHidden(true);
		gCalendarLoadCalendarApi();
	} else {
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		window.vm.gCalendarButtonHidden(false);
	}
}


/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function gCalendarHandleAuthClick(event) {
	if (typeof gapi === 'undefined') {
		alert('Sorry, Google Calendar has failed to load and can\'t be accessed. Try reloading this page.');
	} else {
		gapi.auth.authorize({
				client_id: GCALENDAR_CLIENT_ID,
				scope: GCALENDAR_SCOPES,
				immediate: false
			},
			gCalendarHandleAuthResult);
		return false;
	}
}


/**
 * Load Google Calendar client library.
 */
function gCalendarLoadCalendarApi() {
	gapi.client.load('calendar', 'v3', gCalendarInsertEvent);
}


/**
 * makes a request to Google Calendar to insert an event into Primary Calendar of current user
 * requires global gCalendarEvent object
 */
function gCalendarInsertEvent() {
	// Refer to the JavaScript quickstart on how to setup the environment:
	// https://developers.google.com/google-apps/calendar/quickstart/js
	// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
	// stored credentials.

	var request = gapi.client.calendar.events.insert({
		"calendarId": "primary",
		"resource": gCalendarEvent
	});

	request.execute(function(value) {
		var resultText;
		if (value.error !== undefined) {
			resultText = 'Sorry, there was an error trying to add the event into Google Calendar. Google Calendar API Error: ' + value.error.code + ' - ' + value.error.message;
			alert(resultText);
			console.log(resultText);
		} else {
			resultText = 'Success! Event has been added to your calendar: <a href="' + value.htmlLink + '" target="_blank">View</a>';
			window.vm.displayGCalendarResult(resultText);
			if (DEBUG) {
				console.log(resultText);
			}
		}
	});
}
