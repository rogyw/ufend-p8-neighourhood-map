/* ======================================================= */
/* Third Party API - Google Calendar
/* ======================================================= */

"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel : true */
// set jshint to ignore external globals
/* global gCalendarEvent, gapi : false */

// Code Reference: Based on https://developers.google.com/google-apps/calendar/quickstart/js

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var GCALENDAR_CLIENT_ID = '1035036075694-1eocpmula50dhlu5t8cmealdhhj70t6b.apps.googleusercontent.com';

//Read/Write Google Calendar Scope required to insert events
var GCALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Debugging of output to console.log
var DEBUG_GCALENDAR = true;


/**
 * Check if current user has authorized this application.
 */
function gCalendarCheckAuth() {
	if (DEBUG_GCALENDAR) { console.log("gCalendarCheckAuth: Start - Check if current user has authorized this application."); }
	gapi.auth.authorize({
		'client_id': GCALENDAR_CLIENT_ID,
		'scope': GCALENDAR_SCOPES.join(' '),
		'immediate': true
	}, gCalendarHandleAuthResult);
}


/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function gCalendarHandleAuthResult(authResult) {
	if (DEBUG_GCALENDAR) { console.log("gCalendarHandleAuthResult: Start - Handle response from authorization server."); }
	var authorizeElement = document.getElementsByClassName('g-calendar-button');
	console.log(authorizeElement[0]);
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		if (DEBUG_GCALENDAR) { console.log("gCalendarHandleAuthResult: (authResult && !authResult.error) Hide auth UI, then load client library."); }
		authorizeElement[0].style.display = 'none';
		gCalendarLoadCalendarApi();
	} else {
		if (DEBUG_GCALENDAR) { console.log("gCalendarHandleAuthResult: Show auth UI, allowing the user to initiate authorization by clicking authorize button."); }
		// Show auth UI, allowing the user to initiate authorization by
		// clicking authorize button.
		authorizeElement[0].style.display = 'inline';
	}
}


/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function gCalendarHandleAuthClick(event) {
	if (DEBUG_GCALENDAR) { console.log("gCalendarHandleAuthClick: Start - Initiate auth flow in response to user clicking authorize button."); }
	if (typeof gapi === 'undefined') {
		alert("Sorry, Google Calendar has failed to load and can't be accessed. Try reloading this page.");
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
	if (DEBUG_GCALENDAR) { console.log("gCalendarLoadCalendarApi: Start - Load Google Calendar client library"); }
	gapi.client.load('calendar', 'v3', gCalendarInsertEvent);
}


function gCalendarInsertEvent() {
	// Refer to the JavaScript quickstart on how to setup the environment:
	// https://developers.google.com/google-apps/calendar/quickstart/js
	// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
	// stored credentials.
	if (DEBUG_GCALENDAR) {
		console.log("gCalendarInsertEvent: Start");
		console.log("gCalendarInsertEvent: gCalendarEvent =");
		console.log(gCalendarEvent);
	}

	var request = gapi.client.calendar.events.insert({
		'calendarId': 'primary',
		'resource': gCalendarEvent
	});

	if (DEBUG_GCALENDAR) { console.log("gCalendarInsertEvent: request execute"); }

	request.execute(function(value) {
		if (DEBUG_GCALENDAR) {
			console.log("gCalendarInsertEvent: value=");
			console.log(value);
		}

		if (value.error !== undefined) {
			var errorMessage = "Google Calendar API Request Error: " + value.error.code + " - " + value.error.message;
			console.log("errorMessage");
			replaceAuthorizeElement(errorMessage);
		} else {
			var result = 'Event added to your calendar: <a href="' + value.htmlLink + '" target="_blank">View</a>';
			replaceAuthorizeElement(result);
			if (DEBUG_GCALENDAR) { console.log(result); }
		}
	});

}


/**
 * Replaces the authorise element contents to the given message.
 *
 * @param {string} message Text to be placed in pre element.
 */
function replaceAuthorizeElement(message) {
	var authorizeElement = document.getElementsByClassName('g-calendar-button');
	console.log(authorizeElement);
	authorizeElement[0].innerHTML = '<p>' + message + '</p>';
	authorizeElement[0].style.display = 'inline';
}
