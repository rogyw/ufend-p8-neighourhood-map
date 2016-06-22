## ufend-p8-neighbourhood-map

The original live copy of this project is available at:
[http://roger.navevent.co.nz/orienteering-events-map/](http://roger.navevent.co.nz/orienteering-events-map/)


### Introduction

The "Auckland Orienteering Events" site provides an **interactive display of upcoming orienteering events in the Auckland region** and brief details about the events.

**Interactive text search functionality** is provided within the list of events to assist in finding events on a certain day of the week, upcoming month of the year, or within the region of interest.

For each event, details on the date, registration location, start times and times are provided along with additional **assistance identifying the closest train/bus stations**.

**Adding an individual event into your personal Google calendar** is easy through a button on each event.

This repository contains Roger Woodroofe's completed Map Neighbourhood project for the Udacity Front End Web Developer Nanodegree.
More information on the project requirements are available at: [Udacity Front End Web Developer Nanodegree overview](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001#).

#### About Orienteering

Orienteering is a map based sport and recreational activity.

Orienteers use a detailed orienteering map that uses an international mapping standard of symbols to describe the terrain and how easy it is to traverse (i.e. get from point A to point B). Each course map also identifies the locations course participants need to visit to successfully complete the course they have selected.

Walk, Jog, or Run. Easy through to very challenging navigation. Individuals or go as a group. It's up to the participants.  Orienteering offers an activity that exercises the body and mind at the same time - and top athletes need to manage the balance between both. Suitable for all ages and most abilities, events can be either by foot, mountain-bike, ski's or trail (by vision alone). It's an excellent family based activity as all ages can usually participate in an event during the same time and area.

For more information on Orienteering in New Zealand, visit [Orienteering NZ](http://www.orienteering.org.nz/) or to find your local orienteering organisation visit the [IOF](http://www.orienteering.org/).


### Project Information

#### Third Party Requirements:

* KnockoutJS - for event list management
* Google Maps Javascript API - Map Services
* Material Design Lite - Page and component styles
* JQuery UI - AJAX services and date conversion functionality (Date picker alternative until MDL implementation available).
* InfoBubble Google Maps extension - for tabbed infoWindow support
* php-date-formatter.js script - provides date string formatting

*Additional functionality requires:*

* Google Calendar API - allows user to add event to Calendar
* Auckland Transport (AT) API - allows user to see list of local bus/train stops

Note: Copyright and license text of third party modules are included in their source code.

#### How to Use This Project
##### Repository Structure

Root folder `/` contains build configuration files and this `README.md`
The subfolder `/src/` contains source files and `/dist/` contains the gulp generated optimised files ready for use.

##### A. Initial Development Structure Setup

1. (optional) Fork or clone the [repository](https://github.com/rogyw/ufend-P8-neighbourhood-map.git) on GitHub.
1. Use git to clone the repository to your local system. `git clone https://github.com/rogyw/ufend-P8-neighbourhood-map.git`
1. Install or update to the latest version of [node.js and npm](https://nodejs.org/en/).
1. Open your local console and change the current directory to the project root folder (location of `/package.json` and `/gulpfile.js`).
1. Run the command `npm install` to install required gulp modules and jsDoc as defined in included `package.json` file.
1. Run the command `bower install` to install required bower dependancies.
1. Obtain API Keys and update configuration settings in source as outlined in section below.
1. To refresh the contents of `dist` folder use the command `gulp rebuild`.  The rebuild will delete the old dist folder and rebuild based on current source files.
1. Copy files from `dist` to your web hosting account or alternatively to deploy the contents of `dist` folder to your live `gh-pages` for the repostitory on Github use `gulp deploy`.
1. Visit your site to test it works!

##### B. Configuration of Installation

This repository uses several APIs which require an appropriate API Key to enable the full use of this code.
Note: The keys included in this repository may not be valid or may be limited to use from specific domain names.

1. Google Maps API
  1. Visit the Google Maps API for Web - Javascript documentation pages at [https://developers.google.com/maps/documentation/javascript/](https://developers.google.com/maps/documentation/javascript/)
  1. Obtain a Google Maps Key
  1. Update the following line in the `/src/index.html` to specify your Google Maps Key. Make sure you leave the double quotation mark following the end of the key.
  ```<script defer src="https://maps.googleapis.com/maps/api/js?callback=initMap&key=AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsT" async></script>```
1. Google Calendar
  1. Visit the Google Developer Console for Google APIs, https://console.developers.google.com
  1. Create Credentials for Google OAuth 2.0 and enable the Google Calendar API. Refer to current [Google API Help](https://support.google.com/cloud/answer/6158849) for further instructions.
  1. Edit and save the `src/gcalendar.js` file to set the constant `GCALENDAR_CLIENT_ID` to your personal Google API credentials key. e.g. `var GCALENDAR_CLIENT_ID = '0123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com';`
1. Auckland Transport API
  1. Obtain your API Key by signing up for a development API Key at: [https://api.at.govt.nz/registration/](https://api.at.govt.nz/registration/)
  1. Edit and save the `src/app.js` file to set the constant `API_ATAPI_SECRET_KEY` to your personal Auckland Transport API account key. e.g. `var API_ATAPI_SECRET_KEY = "abcd1234-efgh5678-ijkl9012-mnop3456";`

##### C. Running a Local Http Web Server

(Optional) If you do not currently have an http web server available:

###### HTTP/2 using simplehttp2server

To install simplehttp2server:

1. Download the appropriate precompiled release of simplehttp2server for your system by visiting [simplehttp2server Releases page on Github](https://github.com/GoogleChrome/simplehttp2server/releases).
1. (optional) If required, rename the downloaded file to the appropriate filename for your system. For example on Windows: `rename simplehttp2server_windows_amd64 simplehttp2server.exe`
1. Move the downloaded `simplehttp2server` file into a folder included in your [system path](http://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them).
1. Within a command line console, change current directory to the folder containing files to be served. `cd /pathtofiles/`
1. At the command prompt, type `simplehttp2server`. simplehttp2server will start and display the port number it is listening on.
1. View the site at `https://localhost:5000/` where 5000 is the `listening on` port number.

Note:
 * Further details available in the [simplehttp2server README](https://github.com/GoogleChrome/simplehttp2server/) and the [video - HTTP/2, Totally Tooling Tips](https://www.youtube.com/watch?v=qx9tHwhjkHs).
 * Make sure you use https:// with simplehttp2server as use of http:// will produce unexpected behaviour.
 * A security warning will be displayed in your browser indicating the certificate is provided by an unknown authority.

###### HTTP/1 using Python simplehttpserver or Python http.server

Python provides the ability to easily serve a folder via an http web service on your local development computer for testing purposes.
1. Download and install Python from [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. At the console command line prompt, change to the folder containing the set of files to be used.
```cd /my/path/to/files/dist```
Note: You can use either `/dist/` or `/src/` from the repository.
* `/dist/` contains optimised files for production use. Section A above describes how to generate the `dist` set of files from the repository.
* `/src/` contains the source files before optimisations which will be easier to use if you intend to view, edit, or debug the code.
3. At the console command line prompt, type either:
  * (Python 2) `python -m SimpleHTTPServer 8080` or
  * (Python 3) `python -m http.server 8080`.
  This will start the service serving the current directories files as `http://localhost:8080/`
4. Open a web browser and view `http://localhost:8080/`


##### Optimisations to files in dist completed by Gulp
* gulp-cssnano - minify CSS files
* gulp-autoprefixer - auto-prefix CSS
* gulp-gh-pages - upload to gh-pages
* gulp-uglify  - minify javascript files
* gulp-imagemin - reduce image sizes
* gulp-htmlmin  - minify html files
* run-sequence, del - used for project building


## Changelog

0.2 Project Submission 2
* Updated Documentation
* Adds HTTPS / HTTP/2 Support
* fixes and code improvements

0.1 initial project submission

## Contacts

###Udacity
[Udacity website](https://www.udacity.com/)

###Roger Woodroofe
Contact Roger Woodroofe through [Rogyw on GitHub](https://github.com/rogyw) or email [rogyw@yahoo.co.nz](mailto:rogyw@yahoo.co.nz)
