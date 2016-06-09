"use strict";function gCalendarCheckAuth(){DEBUG_GCALENDAR&&console.log("gCalendarCheckAuth: Start - Check if current user has authorized this application."),gapi.auth.authorize({client_id:GCALENDAR_CLIENT_ID,scope:GCALENDAR_SCOPES.join(" "),immediate:!0},gCalendarHandleAuthResult)}function gCalendarHandleAuthResult(e){DEBUG_GCALENDAR&&console.log("gCalendarHandleAuthResult: Start - Handle response from authorization server.");var a=document.getElementsByClassName("g-calendar-button");console.log(a[0]),e&&!e.error?(DEBUG_GCALENDAR&&console.log("gCalendarHandleAuthResult: (authResult && !authResult.error) Hide auth UI, then load client library."),a[0].style.display="none",gCalendarLoadCalendarApi()):(DEBUG_GCALENDAR&&console.log("gCalendarHandleAuthResult: Show auth UI, allowing the user to initiate authorization by clicking authorize button."),a[0].style.display="inline")}function gCalendarHandleAuthClick(e){return DEBUG_GCALENDAR&&console.log("gCalendarHandleAuthClick: Start - Initiate auth flow in response to user clicking authorize button."),"undefined"!=typeof gapi?(gapi.auth.authorize({client_id:GCALENDAR_CLIENT_ID,scope:GCALENDAR_SCOPES,immediate:!1},gCalendarHandleAuthResult),!1):void alert("Sorry, Google Calendar has failed to load and can't be accessed. Try reloading this page.")}function gCalendarLoadCalendarApi(){DEBUG_GCALENDAR&&console.log("gCalendarLoadCalendarApi: Start - Load Google Calendar client library"),gapi.client.load("calendar","v3",gCalendarInsertEvent)}function gCalendarInsertEvent(){DEBUG_GCALENDAR&&(console.log("gCalendarInsertEvent: Start"),console.log("gCalendarInsertEvent: gCalendarEvent ="),console.log(gCalendarEvent));var e=gapi.client.calendar.events.insert({calendarId:"primary",resource:gCalendarEvent});DEBUG_GCALENDAR&&console.log("gCalendarInsertEvent: request execute"),e.execute(function(e){DEBUG_GCALENDAR&&(console.log("gCalendarInsertEvent: value="),console.log(e));var a;void 0!==e.error?(a="Sorry, there was an error trying to add the event into Google Calendar. Google Calendar API Error: "+e.error.code+" - "+e.error.message,alert(a),console.log(a)):(a='Success! Event has been added to your calendar: <a href="'+e.htmlLink+'" target="_blank">View</a>',replaceAuthorizeElement(a),DEBUG_GCALENDAR&&console.log(a))})}function replaceAuthorizeElement(e){var a=document.getElementsByClassName("g-calendar-button");console.log(a),a[0].innerHTML="<p>"+e+"</p>",a[0].style.display="inline"}var GCALENDAR_CLIENT_ID="1035036075694-1eocpmula50dhlu5t8cmealdhhj70t6b.apps.googleusercontent.com",GCALENDAR_SCOPES=["https://www.googleapis.com/auth/calendar"],DEBUG_GCALENDAR=!1;