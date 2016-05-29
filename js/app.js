"use strict";

// set jshint to ignore console, alert, etc
/* jshint devel: true */
// set jshint to ignore external globals
/* global ko, eventsJSON: false */

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
		self.date = ko.observable(data.date);
		self.series = ko.observable(data.series);
		self.name = ko.observable(data.name);
		self.startFirst = ko.observable(data.startFirst);
		self.startLast = ko.observable(data.startLast);
		self.courseClose = ko.observable(data.courseClose);
		self.registrationCoord = ko.observable(data.registrationCoord);
		self.notes = ko.observable(data.notes);
	}
};


/**
 * viewModel
 */
var viewModel = function() {

	//self represents the ViewModel this
	var self = this;

	self.eventList = ko.observableArray([]);
	self.filter = ko.observable("");

	eventsJSON.forEach(function(eventItem) {
		self.eventList.push(new oEvent(eventItem));
	});

	//filter the items using the filter text
	// Reference http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
	self.filteredEvents = ko.dependentObservable(function() {
		var filter = this.filter().toLowerCase();
		if (!filter) {
			//return all the items
			return this.eventList();
		} else {
			return ko.utils.arrayFilter(this.eventList(), function(event) {
				return (event.name().toLowerCase().search(filter) !== -1);
			});
		}
	}, self);
};

ko.applyBindings(new viewModel());
