"use strict";function createEventMarker(e,t,a,n){var s=new google.maps.Marker({position:e,map:map,title:t,icon:MAP_MARKER_ICON});return s.setMap(map),google.maps.event.addListener(s,"click",function(){s.setAnimation(google.maps.Animation.BOUNCE);window.setTimeout(function(){s.setAnimation(null)},2100);if(void 0===infoBubble&&(infoBubble=new InfoBubble({maxWidth:MAP_INFOBUBBLE_WIDTH_MAX})),infoBubble){for(var t=infoBubbleTabCount;t>0;t--)infoBubble.removeTab(t-1),DEBUG&&console.log("Removing infoBubble Tab: "+t);infoBubbleTabCount=0,infoBubble.close()}infoBubble.open(map,s),requestRoutes(e),gCalendarEvent=n,DEBUG&&(console.log("gCalendar Event ="),console.log(gCalendarEvent));var o=[],r='<div class="map-info">';r+=a,r+="</div>",o.push({tabName:"Event Details",content:r}),infoBubble.addTab(o[0].tabName,o[0].content),infoBubbleTabCount+=1}),s}function enableMapMarker(e){e.mapMarker.setMap(map)}function disableMapMarker(e){e.mapMarker.setMap(null)}function resizeMap(e){var t=e.length;if(infoBubble&&infoBubble.close(),1>t)map.setZoom(DEFAULT_MAP_ZOOM),map.setCenter(DEFAULT_MAP_CENTRE);else{for(var a=new google.maps.LatLngBounds,n=0;t>n;n++){var s=e[n].mapMarker.position;a.extend(s)}map.setCenter(a.getCenter()),map.fitBounds(a)}}function initMap(){var e={center:DEFAULT_MAP_CENTRE,zoom:DEFAULT_MAP_ZOOM,maxZoom:DEFAULT_ZOOM_MAX};map=new google.maps.Map(document.getElementById("map"),e);var t=document.getElementById("neighbourhood-map-spinner");t.style.display="none",ko.applyBindings(new viewModel)}function getUTCDate(e){var t=e.split(" "),a=t[0].split("-"),n=t[1].split(":");a[1]=a[1]-1;var s=new Date(Date.UTC(a[0],a[1],a[2],n[0],n[1]));return s}function getTimeString(e){var t=dateFormat.formatDate(e,"g:ia");return t}function requestRoutes(e,t){var a=$.ajax({url:"http://api.at.govt.nz/v1/gtfs/stops/geosearch?lat="+e.lat+"&lng="+e.lng+"&distance="+API_ATAPI_STOP_DISTANCE+"&api_key="+API_ATAPI_SECRET_KEY,type:"GET",dataType:"jsonp",timeout:AJAX_API_TIMEOUT});a.done(function(e){DEBUG&&(console.log("AT API success."),console.log(e)),dataATAPI=e;var t=dataATAPI.response.length,a='<div class="map-info">';if(a+="<h3>Bus &amp; Train Stops Nearby</h3>",1>t)a+="<p>No public transport stops found within "+API_ATAPI_STOP_DISTANCE+" metres of registration location. Please click link below for alternate details.</p>";else{a+='<ul class="busstops">',a+='<li><span class="busstops-code">Stop #</span><span class="busstops-address">Address</span> <span class="busstops-distance">Distance</span>';for(var n=1;n<dataATAPI.response.length&&MAX_BUSSTOPS+1>n;n++)a+="<li>",a+='<span class="busstops-code">'+dataATAPI.response[n].stop_code+'</span><span class="busstops-address">'+dataATAPI.response[n].stop_name+'</span> <span class="busstops-distance">('+parseInt(dataATAPI.response[n].st_distance_sphere,10)+"m)</span>",a+="</li>";a+="</ul>",a+='<p><a href="https://at.govt.nz/bus-train-ferry/journey-planner/" target="_blank">Plan Your Trip</a></p>',a+='<div class="api-provider">',a+='<p><a href="'+API_ATAPI_WEBSITE+'" target="_blank"><img alt="AT" src="'+API_ATAPI_LOGO+'"></a>',a+='Data provided by: <a href="'+API_ATAPI_WEBSITE+'" target="_blank">at.govt.nz</a></p>',a+="</div>"}a+="</div>",infoBubble.addTab("Bus/Train",a),infoBubbleTabCount+=1}),a.fail(function(e,t){alert("Sorry, we experienced a problem with the Auckland Transport API. Bus/Train information is temporarily unavailable. Error: "+t),DEBUG&&(console.log("AT API call failure:"),console.log(t))})}var DEFAULT_MAP_CENTRE={lat:-36.9001229,lng:174.7826388},DEFAULT_MAP_ZOOM=11,DEFAULT_ZOOM_MAX=16,MAP_MARKER_ICON="https://raw.githubusercontent.com/rogyw/ufend-p8-neighourhood-map/master/img/marker-o-flag.png",MAP_INFOBUBBLE_WIDTH_MAX=250,AJAX_API_TIMEOUT=1e4,APP_LOAD_TIMEOUT=15e3,API_ATAPI_STOP_DISTANCE=1e3,API_ATAPI_SECRET_KEY="66ea2049-30bf-4ce3-bd6b-701e458de648",API_ATAPI_LOGO="http://at-api.aucklandtransport.govt.nz/imageresizer/website/logo.png?width=55",API_ATAPI_WEBSITE="https://at.govt.nz",MAX_BUSSTOPS=8,IMAGE_LOGO_AK_SUMMERNAV="http://www.orienteeringauckland.org.nz/assets/Uploads/Resource/Logos/logo-summernav-sml.png",DEBUG=!1,map,infoBubble,infoBubbleTabCount=0,dataATAPI,gCalendarEvent,appLoaded=!1;window.setTimeout(function(){if(appLoaded===!1){var e=document.getElementsByClassName("mdl-spinner");void 0!==e[0]&&(e[0].className=e[0].className.replace("is-active","")),alert("Sorry, a timeout error has occurred while trying to access the internet. Please check connection and try again. If problem persists, please contact support.")}},APP_LOAD_TIMEOUT);var dateFormat=new DateFormatter,oEvent=function(e){var t=this;null!==e&&(t.dateUTC=ko.observable(getUTCDate(e.dateUTC)),t.series=ko.observable(e.series),t.name=ko.observable(e.name),t.startFirstUTC=ko.observable(getUTCDate(e.startFirstUTC)),t.startLastUTC=ko.observable(getUTCDate(e.startLastUTC)),t.courseCloseUTC=ko.observable(getUTCDate(e.courseCloseUTC)),t.registrationCoord=ko.observable(e.registrationCoord),t.notes=ko.observable(e.notes),t.url=ko.observable(e.url),t.title=ko.computed(function(){return t.series()+" - "+t.name()}),t.dateShort=ko.computed(function(){return dateFormat.formatDate(t.dateUTC(),"D j M Y")}),t.infoBubbleContent=ko.computed(function(){var e=$.datepicker.formatDate("DD d MM yy",t.dateUTC()),a=getTimeString(t.startFirstUTC()),n=getTimeString(t.startLastUTC()),s=getTimeString(t.courseCloseUTC()),o="";return"Auckland SummerNav"==t.series()&&(o+='<img class="img-summernav" src="'+IMAGE_LOGO_AK_SUMMERNAV+'" alt="Auckland SummerNav">'),o+="<h3>"+e+"</h3>",o+="<h4>"+t.name()+"</h4>",o+="<ul>",o+='<li><h5>Event Series:</h5> <span class="detail"><strong>'+t.series()+"</strong></span></li>",o+='<li><h5>Start Anytime Between:</h5> <span class="detail">'+a+" - "+n+"</span></li>",o+='<li><h5>Course Closure:</h5> <span class="detail">'+s+"</span></li>",""!==t.notes()&&(o+='<li><h5>Notes:</h5> <span class="notes">'+t.notes()+"</span></li>"),o+='<li><h5>Website:</h5><span class="detail"><a href="'+t.url()+'" target="_blank">'+t.url()+"</a></span></li>",o+='<li class="notice">Please check onsite noticeboard for updates</li>',o+='<li class="g-calendar-button"><button name="button-g-calendar-add" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick = "gCalendarHandleAuthClick()">Add Event to Google Calendar</button>',o+="</ul>"}),t.gCalendarEvent=ko.computed(function(){var e="",a=getTimeString(t.startFirstUTC()),n=getTimeString(t.startLastUTC()),s=getTimeString(t.courseCloseUTC());e+="Start any time between "+a+" and "+n+". ",e+="Course Closure is usually "+s+". ",""!==t.notes()&&(e+="Notes: "+t.notes()+". "),e+="Please always check onsite noticeboard for updates and notices.",e+="Further information available at: http://auckoc.org.nz/";var o={summary:t.title()+"- Orienteering "+t.series(),location:t.registrationCoord().lat+", "+t.registrationCoord().lng,description:e,start:{dateTime:t.startFirstUTC(),timeZone:"Pacific/Auckland"},end:{dateTime:t.courseCloseUTC(),timeZone:"Pacific/Auckland"},reminders:{useDefault:!1,overrides:[{method:"email",minutes:1440},{method:"popup",minutes:10}]}};return o}),t.data=e,t.mapMarker=createEventMarker(t.registrationCoord(),t.title(),t.infoBubbleContent(),t.gCalendarEvent()))},viewModel=function(){var e=this;e.eventsList=ko.observableArray(),e.filter=ko.observable(""),eventsJSON.sort(function(e,t){return e.dateUTC>t.dateUTC?-1:e.dateUTC<t.dateUTC?1:0}),eventsJSON.forEach(function(t){e.eventsList.push(new oEvent(t))}),e.filteredEvents=ko.computed(function(){var e,t=this.filter().toLowerCase();return t?e=ko.utils.arrayFilter(this.eventsList(),function(e){return-1!==e.name().toLowerCase().search(t)||-1!==e.dateShort().toLowerCase().search(t)?(enableMapMarker(e),!0):(disableMapMarker(e),!1)}):(this.eventsList().forEach(enableMapMarker),e=this.eventsList()),e.sort(function(e,t){return e.dateUTC()<t.dateUTC()?-1:e.dateUTC()>t.dateUTC()?1:0})},e),e.filteredEvents.subscribe(function(e){resizeMap(e)}),e.redrawMap=function(){resizeMap(e.filteredEvents())},window.addEventListener("resize",e.redrawMap),e.eventListClick=function(e){google.maps.event.trigger(e.mapMarker,"click")},appLoaded=!0};