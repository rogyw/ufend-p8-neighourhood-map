/*
 * =======================================================
 * helpers.js
 *  - contains helper functions for
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Including Date manipulation and String helpers
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */

"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
/* global DateFormatter :false */


/* ======================================================= */
/* Date Format Library Global */
/* ======================================================= */
var dateFormat = new DateFormatter();


/* ======================================================= */
/* Date/Time Helper Functions*/
/* ======================================================= */

/**
 * Converts a date in YY-MM-DD HH:MM to a date object
 * Reference: Based on http://stackoverflow.com/a/22835394
 * @param  {string} ymdString string in YY-MM-DD HH:MM UTC format
 * @return {date}   The javascript date representing the UTC time string
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


/**
 * returns time string in 12 hour time H:mm am/pm format
 * (requires third party javascript library php-date-formatter)
 * @param  {date} value a javascript date object
 * @return {string}       the time string
 */
function getTimeString(value) {

	//Requires: https://github.com/kartik-v/php-date-formatter
	var result = dateFormat.formatDate(value, 'g:ia');

	return result;
}

/**
 * returns time string in 24 hour time HM:mm format
 * (requires third party javascript library php-date-formatter)
 * @param  {date} value a javascript date object
 * @return {string}       the time string
 */
function getTime24String(value) {

	//Requires: https://github.com/kartik-v/php-date-formatter
	var result = dateFormat.formatDate(value, 'H:i');

	return result;
}


/**
 * returns date string in YYYY-MM-DD format
 * (requires third party javascript library php-date-formatter)
 * @param  {date} value a javascript date object
 * @return {string}       the date string in YYYY-MM-DD
 */
function getDateString(value) {

	//Requires: https://github.com/kartik-v/php-date-formatter
	var result = dateFormat.formatDate(value, 'Y-m-d');

	return result;
}

/* ======================================================= */
/* String Helper Functions*/
/* ======================================================= */

/**
 * returns the url string without the http:// or https:// prefix
 * @param  {string}  url to have prefix removed
 * @return {string}  url with the http(s):// prefix removed
 */
function stripUrlHttp(url) {
	if (typeof(url) !== 'string') {
		//return url untouched if not given a string
		return url;
	}
	var result = url.trim();
	result = result.replace(/^http[s]?\:\/\//i, "");
	return result;
}
