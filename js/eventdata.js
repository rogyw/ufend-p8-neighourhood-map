"use strict";

var eventType = [{
	"name": "SummerNav Evening",
	"startFirst": "17:30",
	"startLast": "18:45",
	"courseClose": "19:30",
	"notes": "Compass not usually required."
}, {
	"name": "SummerNav Night",
	"startFirst": "20:30",
	"startLast": "20:30",
	"courseClose": "21:15",
	"notes": "Bring a good torch or headlamp; Kids can start at dusk; Compass recommended."
}, {
	"name": "AOA Forest",
	"startFirst": "10:00",
	"startLast": "12:30",
	"courseClose": "14:30",
	"notes": "Recommend bringing whistle and compass. Bring a good torch or headlamp; Kids can start at dusk; "
}, {
	"name": "Winter Sprint Afternoon",
	"startFirst": "16:00",
	"startLast": "16:30",
	"courseClose": "17:00",
	"notes": "Sprint, Jog, or Walk. Expected fastest time of 12 minutes for each course."
}, {
	"name": "WinterNav Afternoon",
	"startFirst": "13:00",
	"startLast": "14:15",
	"courseClose": "16:00",
	"notes": "Compass not usually required."
}];

var events = [{
	"date": "2016-10-27",
	"venue": "Cornwall Park",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.903482,
		lng: 174.784422
	},
	"notes": ""
}, {
	"date": "2016-11-02 Nov",
	"venue": "Hamlins Hill",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.923982,
		lng: 174.831291
	},
	"notes": ""
}, {
	"date": "2016-11-10 Nov",
	"venue": "Auckland Domain",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.863269,
		lng: 174.771962
	},
	"notes": "Grandstand"
}, {
	"date": "2016-11-16 Nov",
	"venue": "Highbrook",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.944184,
		lng: 174.871469
	},
	"notes": ""
}, {
	"date": "2016-11-22 Nov",
	"venue": "Western Springs",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.865097,
		lng: 174.720507
	},
	"notes": "Zoo Carpark, Mertons Road"
}, {
	"date": "2016-11-30 Nov",
	"venue": "Craigavon",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.928414,
		lng: 174.690347
	},
	"notes": ""
}, {
	"date": "2016-12-08 Dec",
	"venue": "Ambury Park",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.945714,
		lng: 174.761737
	},
	"notes": "No Dogs Permitted."
}, {
	"date": "2016-12-14 Dec",
	"venue": "Epsom Campus",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.885772,
		lng: 174.767751
	},
	"notes": ""
}, {
	"date": "2017-01-25 Jan",
	"venue": "Pt England",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.883369,
		lng: 174.871948
	},
	"notes": ""
}, {
	"date": "2017-01-31 Jan",
	"venue": "Alexandra Park & Schools",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.889485,
		lng: 174.776607
	},
	"notes": ""
}, {
	"date": "2017-02-08 Feb",
	"venue": "Lloyd Elsmore",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.907876,
		lng: 174.901683
	},
	"notes": ""
}, {
	"date": "2017-02-14 Feb",
	"venue": "Cornwall Park",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.898066,
		lng: 174.788799
	},
	"notes": ""
}, {
	"date": "2017-02-18 Feb",
	"venue": "(Night Event) Ambury Park",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.945714,
		lng: 174.761737
	},
	"notes": "No Dogs Permitted."
}, {
	"date": "2017-02-23 Feb",
	"venue": "Panmure Basin",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.908449,
		lng: 174.848238
	},
	"notes": ""
}, {
	"date": "2017-03-01 Mar",
	"venue": "Selfs Farm",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.982238,
		lng: 174.826492
	},
	"notes": ""
}, {
	"date": "2017-03-07 Mar",
	"venue": "Auckland Domain",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.862014,
		lng: 174.778579
	},
	"notes": ""
}, {
	"date": "2017-03-16 Mar",
	"venue": "Ellerslie Racecourse",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.888302,
		lng: 174.803875
	},
	"notes": ""
}, {
	"date": "2017-03-22 Mar",
	"venue": "Western Springs",
	"eventType": "SummerNav Evening",
	"registrationLocation": {
		lat: -36.865933,
		lng: 174.727192
	},
	"notes": ""
}, {
	"date": "2017-05-20 May",
	"venue": "Cornwall Park",
	"eventType": "WinterNav Afternoon",
	"registrationLocation": {
		lat: -36.898066,
		lng: 174.788799
	},
	"notes": ""
}, {
	"date": "2017-06-17 Jun",
	"venue": "Craigavon",
	"eventType": "WinterNav Afternoon",
	"registrationLocation": {
		lat: -36.928414,
		lng: 174.690347
	},
	"notes": ""
}, {
	"date": "2017-08-19 Aug",
	"venue": "Auckland Domain",
	"eventType": "Winter Sprint Afternoon",
	"registrationLocation": {
		lat: -36.863269,
		lng: 174.771962
	},
	"notes": ""
}, {
	"date": "2017-09-16 Sep",
	"venue": "Western Springs",
	"eventType": "Winter Sprint Afternoon",
	"registrationLocation": {
		lat: -36.865097,
		lng: 174.720507
	},
	"notes": ""
}];
