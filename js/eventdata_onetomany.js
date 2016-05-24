"use strict";

var eventTypeIDs = [{
	"id": 1,
	"name": "SummerNav Evening",
	"startFirst": "17:30",
	"startLast": "18:45",
	"courseClose": "19:30",
	"notes": "Compass not usually required."
}, {
	"id": 2,
	"name": "SummerNav Night",
	"startFirst": "20:30",
	"startLast": "20:30",
	"courseClose": "21:15",
	"notes": "Bring a good torch or headlamp; Kids can start at dusk; Compass recommended."
}, {
	"id": 3,
	"name": "AOA Forest",
	"startFirst": "10:00",
	"startLast": "12:30",
	"courseClose": "14:30",
	"notes": "Whistle and compass recommended."
}, {
	"id": 4,
	"name": "Winter Sprint Afternoon",
	"startFirst": "16:00",
	"startLast": "16:30",
	"courseClose": "17:00",
	"notes": "Sprint, Jog, or Walk. Expected fastest time of 12 minutes for each course."
}, {
	"id": 5,
	"name": "WinterNav Afternoon",
	"startFirst": "13:00",
	"startLast": "14:15",
	"courseClose": "16:00",
	"notes": "Compass not usually required."
}];


var locations = [{
	"id": 1,
	"name": "Cornwall Park - Archery Carpark",
	"registrationCoord": {
		lat: -36.903482,
		lng: 174.784422
	},
	"notes": ""
}, {
	"id": 2,
	"name": "Hamlins Hill - Carpark",
	"registrationCoord": {
		lat: -36.923982,
		lng: 174.831291
	},
	"notes": ""
}, {
	"id": 3,
	"name": "Auckland Domain - Cricket Grandstand",
	"registrationCoord": {
		lat: -36.863269,
		lng: 174.771962
	},
	"notes": ""
}, {
	"id": 4,
	"name": "Highbrook - Pukekiwiriki Entrance",
	"registrationCoord": {
		lat: -36.944184,
		lng: 174.871469
	},
	"notes": ""
}, {
	"id": 5,
	"name": "Western Springs - Zoo Carpark",
	"registrationCoord": {
		lat: -36.865097,
		lng: 174.720507
	},
	"notes": ""
}, {
	"id": 6,
	"name": "Craigavon",
	"registrationCoord": {
		lat: -36.928414,
		lng: 174.690347
	},
	"notes": ""
}, {
	"id": 7,
	"name": "Ambury Park",
	"registrationCoord": {
		lat: -36.945714,
		lng: 174.761737
	},
	"notes": "No Dogs Permitted."
}, {
	"id": 8,
	"name": "Epsom Campus - St Andrews Rd Entrance",
	"registrationCoord": {
		lat: -36.885772,
		lng: 174.767751
	},
	"notes": ""
}, {
	"id": 9,
	"name": "Pt England",
	"registrationCoord": {
		lat: -36.883369,
		lng: 174.871948
	},
	"notes": ""
}, {
	"id": 10,
	"name": "Alexandra Park Raceway - Campbell Crescent Entrance",
	"registrationCoord": {
		lat: -36.889485,
		lng: 174.776607
	},
	"notes": ""
}, {
	"id": 11,
	"name": "Lloyd Elsmore - Rugby Carpark",
	"registrationCoord": {
		lat: -36.907876,
		lng: 174.901683
	},
	"notes": ""
}, {
	"id": 12,
	"name": "Cornwall Park - Ha Ha Wall",
	"registrationCoord": {
		lat: -36.898066,
		lng: 174.788799
	},
	"notes": ""
}, {
	"id": 13,
	"name": "Self's Farm",
	"registrationCoord": {
		lat: -36.982238,
		lng: 174.826492
	},
	"notes": "Working Private Farm."
}, {
	"id": 14,
	"name": "Auckland Domain - Maunsell Rd Carpark",
	"registrationCoord": {
		lat: -36.862014,
		lng: 174.778579
	},
	"notes": ""
}, {
	"id": 15,
	"name": "Ellerslie Racecourse - Golf Carpark",
	"registrationCoord": {
		lat: -36.888302,
		lng: 174.803875
	},
	"notes": ""
}, {
	"id": 16,
	"name": "Western Springs Stadium",
	"registrationCoord": {
		lat: -36.865933,
		lng: 174.727192
	},
	"notes": ""
}, {
	"id": 17,
	"name": "Panmure Basin",
	"registrationCoord": {
		lat: -36.908449,
		lng: 174.848238
	},
	"notes": ""
}];


var events = [{
	"date": "2016-10-27",
	"series": "Auckland SummerNav",
	"name": "Cornwall Park",
	"eventTypeID": 1,
	"locationID": 1,
	"notes": ""
}, {
	"date": "2016-11-02",
	"name": "Hamlins Hill",
	"eventTypeID": 1,
	"locationID": 2,
	"notes": ""
}, {
	"date": "2016-11-10",
	"venue": "Auckland Domain",
	"eventTypeID": 1,
	"locationID": 3,
	"notes": "Cricket Grandstand"
}, {
	"date": "2016-11-16 Nov",
	"venue": "Highbrook",
	"eventTypeID": 1,
	"locationID": 4,
	"notes": ""
}, {
	"date": "2016-11-22 Nov",
	"venue": "Western Springs",
	"eventTypeID": 1,
	"locationID": 5,
	"notes": "Zoo Carpark, Mertons Road"
}, {
	"date": "2016-11-30 Nov",
	"venue": "Craigavon",
	"eventTypeID": 1,
	"locationID": 6,
	"notes": ""
}, {
	"date": "2016-12-08 Dec",
	"venue": "Ambury Park",
	"eventTypeID": 1,
	"locationID": 7,
	"notes": ""
}, {
	"date": "2016-12-14 Dec",
	"venue": "Epsom Campus",
	"eventTypeID": 1,
	"locationID": 8,
	"notes": ""
}, {
	"date": "2017-01-25 Jan",
	"venue": "Pt England",
	"eventTypeID": 1,
	"locationID": 9,
	"notes": ""
}, {
	"date": "2017-01-31 Jan",
	"venue": "Alexandra Park & Schools",
	"eventTypeID": 1,
	"locationID": 10,
	"notes": ""
}, {
	"date": "2017-02-08 Feb",
	"venue": "Lloyd Elsmore",
	"eventTypeID": 1,
	"locationID": 11,
	"notes": ""
}, {
	"date": "2017-02-14 Feb",
	"venue": "Cornwall Park",
	"eventTypeID": 1,
	"locationID": 12,
	"notes": ""
}, {
	"date": "2017-02-18 Feb",
	"venue": "(Night Event) Ambury Park",
	"eventTypeID": 2,
	"locationID": 7,
	"notes": ""
}, {
	"date": "2017-02-23 Feb",
	"venue": "Panmure Basin",
	"eventTypeID": 1,
	"locationID": 17,
	"notes": ""
}, {
	"date": "2017-03-01 Mar",
	"venue": "Selfs Farm",
	"eventTypeID": 1,
	"locationID": 13,
	"notes": ""
}, {
	"date": "2017-03-07 Mar",
	"venue": "Auckland Domain",
	"eventTypeID": 1,
	"locationID": 14,
	"notes": ""
}, {
	"date": "2017-03-16 Mar",
	"venue": "Ellerslie Racecourse",
	"eventTypeID": 1,
	"locationID": 15,
	"notes": ""
}, {
	"date": "2017-03-22 Mar",
	"venue": "Western Springs Stadium",
	"eventTypeID": 1,
	"locationID": 16,
	"notes": ""
}, {
	"date": "2017-05-20 May",
	"venue": "Cornwall Park",
	"eventTypeID": 5,
	"locationID": 12,
	"notes": ""
}, {
	"date": "2017-06-17 Jun",
	"venue": "Craigavon",
	"eventTypeID": 5,
	"locationID": 6,
	"notes": ""
}, {
	"date": "2017-08-19 Aug",
	"venue": "Auckland Domain",
	"eventTypeID": 4,
	"locationID": 3,
	"notes": ""
}, {
	"date": "2017-09-16 Sep",
	"venue": "Western Springs",
	"eventTypeID": 4,
	"locationID": 5,
	"notes": ""
}];
