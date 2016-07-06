"use strict";function requestRoutes(e,t){var a,r;window.vm.apiATStations([]);var o=$.ajax({url:"https://api.at.govt.nz/v1/gtfs/stops/geosearch?lat="+e.lat+"&lng="+e.lng+"&distance="+API_ATAPI_STOP_DISTANCE+"&api_key="+API_ATAPI_SECRET_KEY,type:"GET",dataType:"jsonp",timeout:AJAX_API_TIMEOUT});o.done(function(e){if(DEBUG&&(console.log("AT API success."),console.log(e)),dataATAPI=e,"undefined"==typeof e||"null"==e)return a="Error: AT API request - received an unexpected empty reply.",console.log(a),void window.vm.apiATMessage(a);if("undefined"==typeof dataATAPI.response||"Error"==dataATAPI.status)r=dataATAPI.error,console.log("AT API Response Error: "+r.status+" - "+r.message),a="Sorry, no information available. An unexpected response was received from provider.",window.vm.apiATMessage(a);else if(dataATAPI.response.length<1)a="No public transport stops found within "+API_ATAPI_STOP_DISTANCE+" metres of registration location.",window.vm.apiATMessage(a);else for(var t=1;t<dataATAPI.response.length&&MAX_BUSSTOPS+1>t;t++){var o={stopCode:dataATAPI.response[t].stop_code,stopName:dataATAPI.response[t].stop_name,stopDistance:parseInt(dataATAPI.response[t].st_distance_sphere,10)+"m"};DEBUG&&console.log(o),window.vm.apiATStations.push(o)}}),o.fail(function(e,t){var a="Sorry, we experienced a problem with the Auckland Transport API. Bus/Train information is temporarily unavailable. Error: "+t+" Status: "+e.status;console.log(a),window.vm.apiATMessage(a),DEBUG&&(console.log("AT API call failure:"),console.log(t),console.log(e))})}function gCalendarCheckAuth(){gapi.auth.authorize({client_id:GCALENDAR_CLIENT_ID,scope:GCALENDAR_SCOPES.join(" "),immediate:!0},gCalendarHandleAuthResult)}function gCalendarHandleAuthResult(e){var t=document.getElementsByClassName("g-calendar-button");e&&!e.error?(t[0].style.display="none",gCalendarLoadCalendarApi()):t[0].style.display="inline"}function gCalendarHandleAuthClick(e){return"undefined"!=typeof gapi?(gapi.auth.authorize({client_id:GCALENDAR_CLIENT_ID,scope:GCALENDAR_SCOPES,immediate:!1},gCalendarHandleAuthResult),!1):void alert("Sorry, Google Calendar has failed to load and can't be accessed. Try reloading this page.")}function gCalendarLoadCalendarApi(){gapi.client.load("calendar","v3",gCalendarInsertEvent)}function gCalendarInsertEvent(){var e=gapi.client.calendar.events.insert({calendarId:"primary",resource:gCalendarEvent});e.execute(function(e){var t;void 0!==e.error?(t="Sorry, there was an error trying to add the event into Google Calendar. Google Calendar API Error: "+e.error.code+" - "+e.error.message,alert(t),console.log(t)):(t='Success! Event has been added to your calendar: <a href="'+e.htmlLink+'" target="_blank">View</a>',replaceAuthorizeElement(t),DEBUG&&console.log(t))})}function replaceAuthorizeElement(e){var t=document.getElementsByClassName("g-calendar-button");t[0].innerHTML="<p>"+e+"</p>",t[0].style.display="inline"}function createEventMarker(e){var t=e.registrationCoord(),a=e.title(),r=e.gCalendarEvent(),o=new google.maps.Marker({position:t,map:map,title:a,icon:MAP_MARKER_ICON});return o.setMap(map),google.maps.event.addListener(o,"click",function(){window.vm.selectedEvent(e),o.setAnimation(google.maps.Animation.BOUNCE);window.setTimeout(function(){o.setAnimation(null)},2100);infoWindow&&infoWindow.close(),infoWindow.open(map,o),requestRoutes(t),gCalendarEvent=r,DEBUG&&(console.log("gCalendar Event ="),console.log(gCalendarEvent))}),o}function enableMapMarker(e){MAP_MARKER_HIDE_ONLY===!0?e.mapMarker.setVisible(!0):e.mapMarker.setMap(map)}function disableMapMarker(e){MAP_MARKER_HIDE_ONLY===!0?e.mapMarker.setVisible(!1):e.mapMarker.setMap(null)}function resizeMap(e){var t=e.length;if(infoWindow&&infoWindow.close(),1>t)map.setZoom(DEFAULT_MAP_ZOOM),map.setCenter(DEFAULT_MAP_CENTRE);else{for(var a=new google.maps.LatLngBounds,r=0;t>r;r++){var o=e[r].mapMarker.position;a.extend(o)}map.setCenter(a.getCenter()),map.fitBounds(a)}}function onAPIMapLoadError(e){var t="Sorry, an error occurred while trying to load a required resource.\nPlease check internet connection and try again.";"undefined"!=typeof e&&(t+="\nSource:\n"+e.target.src),console.log(t),alert(t);var a=document.getElementById("neighbourhood-map-spinner");a.innerHTML="<h2>Unavailable.</h2><p>Failed to load required resources. Please check internet connection and try again.</p>"}function initMap(){var e={center:DEFAULT_MAP_CENTRE,zoom:DEFAULT_MAP_ZOOM,maxZoom:DEFAULT_ZOOM_MAX},t=document.getElementById("map-main");if("undefined"==typeof t){var a="Application Error: the <div id='map-main' class='map-main'> element to hold map was not found in html.";return console.log(a),void alert(a)}map=new google.maps.Map(t,e),infoWindow=new google.maps.InfoWindow({maxWidth:MAP_INFOWINDOW_WIDTH_MAX}),google.maps.event.addListener(infoWindow,"closeclick",function(){window.vm.selectedEventClose()}),window.vm=new viewModel,ko.applyBindings(window.vm),window.vm.loadingStatus(!1)}function getUTCDate(e){var t=e.split(" "),a=t[0].split("-"),r=t[1].split(":");a[1]=a[1]-1;var o=new Date(Date.UTC(a[0],a[1],a[2],r[0],r[1]));return o}function getTimeString(e){var t=dateFormat.formatDate(e,"g:ia");return t}function stripUrlHttp(e){if("string"!=typeof e)return e;var t=e.trim();return t=t.replace(/^http[s]?\:\/\//i,"")}var dataATAPI,GCALENDAR_CLIENT_ID="1035036075694-1eocpmula50dhlu5t8cmealdhhj70t6b.apps.googleusercontent.com",GCALENDAR_SCOPES=["https://www.googleapis.com/auth/calendar"],DEBUG_GCALENDAR=!1,gCalendarEvent,map,infoWindow,oEvent=function(e){var t=this;null!==e&&(t.dateUTC=ko.observable(getUTCDate(e.dateUTC)),t.series=ko.observable(e.series),t.name=ko.observable(e.name),t.startFirstUTC=ko.observable(getUTCDate(e.startFirstUTC)),t.startLastUTC=ko.observable(getUTCDate(e.startLastUTC)),t.courseCloseUTC=ko.observable(getUTCDate(e.courseCloseUTC)),t.registrationCoord=ko.observable(e.registrationCoord),t.notes=ko.observable(e.notes),t.url=ko.observable(e.url),t.title=ko.computed(function(){return t.series()+" - "+t.name()}),t.dateShort=ko.computed(function(){return dateFormat.formatDate(t.dateUTC(),"D j M Y")}),t.dateString=ko.computed(function(){return $.datepicker.formatDate("DD d MM yy",t.dateUTC())}),t.courseCloseString=ko.computed(function(){return getTimeString(t.courseCloseUTC())}),t.startWindowString=ko.computed(function(){return getTimeString(t.startFirstUTC())+" - "+getTimeString(t.startLastUTC())}),t.websiteString=ko.computed(function(){return stripUrlHttp(t.url())}),t.imageEventSeries=ko.computed(function(){return"Auckland SummerNav"==t.series()?IMAGE_LOGO_AK_SUMMERNAV:IMAGE_LOGO_AK_CLUB}),t.gCalendarEvent=ko.computed(function(){var e="",a=getTimeString(t.startFirstUTC()),r=getTimeString(t.startLastUTC()),o=getTimeString(t.courseCloseUTC());e+="Start any time between "+a+" and "+r+". ",e+="Course Closure is usually "+o+". ",""!==t.notes()&&(e+="Notes: "+t.notes()+". "),e+="Please always check onsite noticeboard for updates and notices.",e+="Further information available at: http://auckoc.org.nz/";var n={summary:t.title()+"- Orienteering "+t.series(),location:t.registrationCoord().lat+", "+t.registrationCoord().lng,description:e,start:{dateTime:t.startFirstUTC(),timeZone:"Pacific/Auckland"},end:{dateTime:t.courseCloseUTC(),timeZone:"Pacific/Auckland"},reminders:{useDefault:!1,overrides:[{method:"email",minutes:1440},{method:"popup",minutes:10}]}};return n}),t.data=e,t.mapMarker=createEventMarker(t))},viewModel=function(){var e=this;e.eventsList=ko.observableArray(),e.filter=ko.observable(""),e.loadingStatus=ko.observable(!0),e.apiATMessage=ko.observable(""),e.apiATLogo=ko.observable(API_ATAPI_LOGO),e.apiATWebsite=ko.observable(API_ATAPI_WEBSITE),e.apiATWebsiteString=ko.observable(stripUrlHttp(API_ATAPI_WEBSITE)),e.apiATStations=ko.observableArray([]),e.displayLoadingWait=ko.computed(function(){return e.loadingStatus()===!0?"loadingWaitDisplayed":"loadingWaitHidden"},e),eventsJSON.sort(function(e,t){return e.dateUTC>t.dateUTC?-1:e.dateUTC<t.dateUTC?1:0}),eventsJSON.forEach(function(t){e.eventsList.push(new oEvent(t))}),e.selectedEvent=ko.observable(),e.selectedEventClose=function(){e.selectedEvent(null),e.apiATStations([])},e.filteredEvents=ko.computed(function(){var e,t=this.filter().toLowerCase();return t?e=ko.utils.arrayFilter(this.eventsList(),function(e){return-1!==e.name().toLowerCase().search(t)||-1!==e.dateShort().toLowerCase().search(t)?(enableMapMarker(e),!0):(disableMapMarker(e),!1)}):(this.eventsList().forEach(enableMapMarker),e=this.eventsList()),e.sort(function(e,t){return e.dateUTC()<t.dateUTC()?-1:e.dateUTC()>t.dateUTC()?1:0})},e),e.filteredEvents.subscribe(function(t){e.selectedEventClose(),resizeMap(t)}),e.redrawMap=function(){resizeMap(e.filteredEvents())},window.addEventListener("resize",e.redrawMap),e.eventListClick=function(e){google.maps.event.trigger(e.mapMarker,"click")}},DEFAULT_MAP_CENTRE={lat:-36.9001229,lng:174.7826388},DEFAULT_MAP_ZOOM=11,DEFAULT_ZOOM_MAX=16,MAP_MARKER_ICON="img/marker-o-flag.png",MAP_INFOWINDOW_WIDTH_MAX=250,MAP_MARKER_HIDE_ONLY=!0,AJAX_API_TIMEOUT=1e4,API_ATAPI_STOP_DISTANCE=1e3,API_ATAPI_SECRET_KEY="66ea2049-30bf-4ce3-bd6b-701e458de648",API_ATAPI_LOGO="https://at-api.aucklandtransport.govt.nz/imageresizer/website/logo.png?width=55",API_ATAPI_WEBSITE="https://at.govt.nz",MAX_BUSSTOPS=8,IMAGE_LOGO_AK_SUMMERNAV="img/logo-summernav-sml.png",IMAGE_LOGO_AK_CLUB="img/clublogo_ak.png",DEBUG=!1,eventsJSON=[{dateUTC:"2016-10-27 04:30",series:"Auckland SummerNav",name:"Cornwall Park",startFirstUTC:"2016-10-27 04:30",startLastUTC:"2016-10-27 05:45",courseCloseUTC:"2016-10-27 06:30",registrationCoord:{lat:-36.903482,lng:174.784422},notes:"Archery Carpark.",url:"http://auckoc.org.nz/"},{dateUTC:"2016-11-02 04:30",series:"Auckland SummerNav",name:"Mutukaroa - Hamlins Hill Regional Park ",startFirstUTC:"2016-11-02 04:30",startLastUTC:"2016-11-02 05:45",courseCloseUTC:"2016-11-02 06:30",registrationCoord:{lat:-36.923982,lng:174.831291},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2016-11-10 04:30",series:"Auckland SummerNav",name:"Auckland Domain",startFirstUTC:"2016-11-10 04:30",startLastUTC:"2016-11-10 05:45",courseCloseUTC:"2016-11-10 06:30",registrationCoord:{lat:-36.863269,lng:174.771962},notes:"Cricket Grandstand.",url:"http://auckoc.org.nz/"},{dateUTC:"2016-11-16 04:30",series:"Auckland SummerNav",name:"Highbrook",startFirstUTC:"2016-11-16 04:30",startLastUTC:"2016-11-16 05:45",courseCloseUTC:"2016-11-16 06:30",registrationCoord:{lat:-36.944184,lng:174.871469},notes:"Pukekiwiriki Entrance.",url:"http://auckoc.org.nz/"},{dateUTC:"2016-11-22 04:30",series:"Auckland SummerNav",name:"Western Springs",startFirstUTC:"2016-11-22 04:30",startLastUTC:"2016-11-22 05:45",courseCloseUTC:"2016-11-22 06:30",registrationCoord:{lat:-36.865097,lng:174.720507},notes:"Zoo Carpark.",url:"http://auckoc.org.nz/"},{dateUTC:"2016-11-30 04:30",series:"Auckland SummerNav",name:"Craigavon",startFirstUTC:"2016-11-30 04:30",startLastUTC:"2016-11-30 05:45",courseCloseUTC:"2016-11-30 06:30",registrationCoord:{lat:-36.928414,lng:174.690347},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2016-12-08 04:30",series:"Auckland SummerNav",name:"Ambury Regional Park",startFirstUTC:"2016-12-08 04:30",startLastUTC:"2016-12-08 05:45",courseCloseUTC:"2016-12-08 06:30",registrationCoord:{lat:-36.945714,lng:174.761737},notes:"No Dogs Permitted.",url:"http://auckoc.org.nz/"},{dateUTC:"2016-12-14 04:30",series:"Auckland SummerNav",name:"Epsom Campus",startFirstUTC:"2016-12-14 04:30",startLastUTC:"2016-12-14 05:45",courseCloseUTC:"2016-12-14 06:30",registrationCoord:{lat:-36.885772,lng:174.767751},notes:"St Andrews Rd Entrance.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-01-25 04:30",series:"Auckland SummerNav",name:"Point England",startFirstUTC:"2017-01-25 04:30",startLastUTC:"2017-01-25 05:45",courseCloseUTC:"2017-01-25 06:30",registrationCoord:{lat:-36.883369,lng:174.871948},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-01-31 04:30",series:"Auckland SummerNav",name:"Alexandra Park Raceway",startFirstUTC:"2017-01-31 04:30",startLastUTC:"2017-01-31 05:45",courseCloseUTC:"2017-01-31 06:30",registrationCoord:{lat:-36.889485,lng:174.776607},notes:"Campbell Crescent Entrance.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-02-08 04:30",series:"Auckland SummerNav",name:"Lloyd Elsmore Park",startFirstUTC:"2017-02-08 04:30",startLastUTC:"2017-02-08 05:45",courseCloseUTC:"2017-02-08 06:30",registrationCoord:{lat:-36.907876,lng:174.901683},notes:"Rugby Carpark.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-02-14 04:30",series:"Auckland SummerNav",name:"Cornwall Park",startFirstUTC:"2017-02-14 04:30",startLastUTC:"2017-02-14 05:45",courseCloseUTC:"2017-02-14 06:30",registrationCoord:{lat:-36.898066,lng:174.788799},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-02-18 04:30",series:"Auckland SummerNav",name:"(Night Event) Ambury Regional Park",startFirstUTC:"2017-02-18 07:30",startLastUTC:"2017-02-18 08:15",courseCloseUTC:"2017-02-18 9:30",registrationCoord:{lat:-36.945714,lng:174.761737},notes:"Bring a good torch or headlamp; Kids can start at dusk; Compass recommended. No Dogs Permitted. Camping available - contact Auckland Council.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-02-23 04:30",series:"Auckland SummerNav",name:"Panmure Basin",startFirstUTC:"2017-02-23 04:30",startLastUTC:"2017-02-23 05:45",courseCloseUTC:"2017-02-23 06:30",registrationCoord:{lat:-36.908449,lng:174.848238},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-03-01 04:30",series:"Auckland SummerNav",name:"Selfs Farm",startFirstUTC:"2017-03-01 04:30",startLastUTC:"2017-03-01 05:45",courseCloseUTC:"2017-03-01 06:30",registrationCoord:{lat:-36.982238,lng:174.826492},notes:"Working Private Farm.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-03-07 04:30",series:"Auckland SummerNav",name:"Auckland Domain",startFirstUTC:"2017-03-07 04:30",startLastUTC:"2017-03-07 05:45",courseCloseUTC:"2017-03-07 06:30",registrationCoord:{lat:-36.862014,lng:174.778579},notes:"Maunsell Rd Carpark.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-03-16 04:30",series:"Auckland SummerNav",name:"Ellerslie Racecourse",startFirstUTC:"2017-03-16 04:30",startLastUTC:"2017-03-16 05:45",courseCloseUTC:"2017-03-16 06:30",registrationCoord:{lat:-36.888302,lng:174.803875},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-03-22 04:30",series:"Auckland SummerNav",name:"Western Springs Stadium",startFirstUTC:"2017-03-22 04:30",startLastUTC:"2017-03-22 05:45",courseCloseUTC:"2017-03-22 06:30",registrationCoord:{lat:-36.865933,lng:174.727192},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-05-20 01:00",series:"Auckland WinterNav",name:"Cornwall Park",startFirstUTC:"2017-05-20 01:00",startLastUTC:"2017-05-20 02:15",courseCloseUTC:"2017-05-20 04:00",registrationCoord:{lat:-36.898066,lng:174.788799},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-06-17 01:00",series:"Auckland WinterNav",name:"Craigavon",startFirstUTC:"2017-06-17 01:00",startLastUTC:"2017-06-17 02:15",courseCloseUTC:"2017-06-17 04:00",registrationCoord:{lat:-36.928414,lng:174.690347},notes:"",url:"http://auckoc.org.nz/"},{dateUTC:"2017-08-19 01:00",series:"Auckland WinterNav",name:"Auckland Domain",startFirstUTC:"2017-08-19 01:00",startLastUTC:"2017-08-19 02:15",courseCloseUTC:"2017-08-19 04:00",registrationCoord:{lat:-36.863269,lng:174.771962},notes:"Cricket Grandstand.",url:"http://auckoc.org.nz/"},{dateUTC:"2017-09-16 01:00",series:"Auckland WinterNav",name:"Western Springs",startFirstUTC:"2017-09-16 01:00",startLastUTC:"2017-09-16 02:15",courseCloseUTC:"2017-09-16 04:00",registrationCoord:{lat:-36.865097,lng:174.720507},notes:"Zoo Carpark.",url:"http://auckoc.org.nz/"}],dateFormat=new DateFormatter;