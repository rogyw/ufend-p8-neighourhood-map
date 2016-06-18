/*
 * =======================================================
 * at.js
 *  - contains functions to interact with Auckland Transport API
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */

"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals that cant be overwritten
/* global $,
	DEBUG,
	AJAX_API_TIMEOUT,
	API_ATAPI_STOP_DISTANCE,
	API_ATAPI_SECRET_KEY,
	API_ATAPI_LOGO,
	API_ATAPI_WEBSITE,
	MAX_BUSSTOPS :false */
// set jshint to ignore external globals that can be overwritten
/* global infoBubble :true */
/* global infoBubbleTabCount :true */


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
function requestRoutes(coordinates, datetime) {
	var request = $.ajax({
		url: "https://api.at.govt.nz/v1/gtfs/stops/geosearch?lat=" + coordinates.lat + "&lng=" + coordinates.lng + "&distance=" + API_ATAPI_STOP_DISTANCE + "&api_key=" + API_ATAPI_SECRET_KEY,
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
		infoBubbleTabCount += 1; //increase tab counter by 1
	});

	request.fail(function(xhr, err) {
		alert("Sorry, we experienced a problem with the Auckland Transport API. Bus/Train information is temporarily unavailable. Error: " + err);
		if (DEBUG) {
			console.log("AT API call failure:");
			console.log(err);
		}
	});
}
