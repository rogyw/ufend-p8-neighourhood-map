/*
 * =======================================================
 * api-at.js
 *  - contains functions to interact with Auckland Transport API
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */

'use strict';

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals that cant be overwritten
/* global $,
	DEBUG,
	AJAX_API_TIMEOUT,
	API_ATAPI_STOP_DISTANCE,
	API_ATAPI_SECRET_KEY,
	MAX_BUSSTOPS :false */


/* ======================================================= */
/* Globals */
/* ======================================================= */
// Data from Auckland Transport API
var dataATAPI;


/* ======================================================= */
/* Third Party API - Auckland Transport
/* ======================================================= */
/**
 * Obtains a list of Bus and Train Stops from Auckland Transport close to the event
 * @param  {object} coordinates Destination coordinates for event. coordinates contains lat and lng values
 * @param  {date } datetime    Event date and start time
 */
function requestRoutes(coordinates) {

	var result, error;

	// Clear all previous AT API call stored values
	window.vm.apiATStations([]);
	window.vm.apiATMessage('');

	var request = $.ajax({
		url: 'https://api.at.govt.nz/v1/gtfs/stops/geosearch?lat=' + coordinates.lat + '&lng=' + coordinates.lng + '&distance=' + API_ATAPI_STOP_DISTANCE + '&api_key=' + API_ATAPI_SECRET_KEY,
		type: "GET",
		dataType: "jsonp",
		timeout: AJAX_API_TIMEOUT,
	});

	request.done(function(data) {
		if (DEBUG) {
			console.log('AT API success.');
			console.log(data);
		}

		dataATAPI = data;

		if ((typeof(data) === 'undefined') || (data == 'null')) {
			result = 'Error: AT API request - received an unexpected empty reply.';
			console.log(result);
			window.vm.apiATMessage(result);
			return;
		}

		//check if an error is being reported by server
		if ((typeof(dataATAPI.response) === 'undefined') || (dataATAPI.status == 'Error')) {
			error = dataATAPI.error;
			console.log('AT API Response Error: ' + error.status + ' - ' + error.message);
			result = 'Sorry, no information available. An unexpected response was received from provider.';
			window.vm.apiATMessage(result);
		} else if (dataATAPI.response.length < 1) {
			//successful request but empty set result
			result = 'No public transport stops found within ' + API_ATAPI_STOP_DISTANCE + ' metres of registration location.';
			window.vm.apiATMessage(result);
		} else {
			// Obtain set of closest stations
			for (var i = 1;
				((i < dataATAPI.response.length) && (i < MAX_BUSSTOPS + 1)); i++) {
				var stop = {
					"stopCode": dataATAPI.response[i].stop_code,
					"stopName": dataATAPI.response[i].stop_name,
					"stopDistance": parseInt(dataATAPI.response[i].st_distance_sphere, 10) + "m"
				};
				if (DEBUG) {
					console.log(stop);
				}
				window.vm.apiATStations.push(stop);
			}
		}
	});

	request.fail(function(xhr, err) {
		var result = 'Sorry, we experienced a problem with the Auckland Transport API. Bus/Train information is temporarily unavailable. Error: ' + err + ' Status: ' + xhr.status;
		console.log(result);
		window.vm.apiATMessage(result);
		if (DEBUG) {
			console.log('AT API call failure:');
			console.log(err);
			console.log(xhr);
		}
	});
}
