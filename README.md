## ufend-p8-neighbourhood-map

A live copy of this project is available at:
[http://roger.navevent.co.nz/orienteering-event-map/](http://roger.navevent.co.nz/orienteering-event-map/)


### Introduction

The "Auckland Orienteering Events" site provides an **interactive display of upcoming orienteering events in the Auckland region** and brief details about the events.

**Interactive text search functionality** is provided within the list of events to assist in finding events on a certain day of the week, upcoming month of the year, or within the areas of interest.

For each event, details on the date, registration location, start times and times are provided along with additional **assistance identifying the closest train/bus stations**.

**Adding an event into your personal Google calendar** is as easy as a click of a button!

This repository contains Roger Woodroofe's completed Map Neighbourhood project for the Udacity Front End Web Developer  Nanodegree.

### About Orienteering

Orienteering is a map based sport and recreational activity.

Orienteers use a detailed orienteering map that uses an international mapping standard of symbols to describe the terrain and how easy it is to traverse (i.e. get from point A to point B). Each course map also identifies the locations course participants need to visit to successfully complete the course they have selected.

Walk, Jog, or Run. Easy or challenging navigation. Individuals or go as a group. It's up to the participants.  Orienteering offers an activity that excercises the body and mind at the same time - and top athletes need to manage the balance between both. Suitable for all ages and most abilities, events can be either by foot, mountain-bike, ski's or trail (by vision alone). It's an excellent family based activity as all ages can usually participate in an event during the same time and area.

For more information on Orienteering in New Zealand, visit [Orienteering NZ](http://www.orienteering.org.nz/) or to find your local orienteering organisation visit the [IOF](http://www.orienteering.org/).


### Project Information

#### Third Party Requirements:

* KnockoutJS - for event list management
* Google Maps Javascript API - Map Services
* Material Design Lite - Page and component styles
* JQuery UI - ajax services and date conversion functionality (Date picker alternative until MDL implementation available).
* InfoBubble Google Maps extension - for tabbed infoWindow support
*php-date-formatter.js script - provides date string formatting

*Additional functionality requires:*

* Google Calendar API - allows user to add event to Calendar
* Auckland Transport (AT) API - allows user to see list of local bus/trin stops


##### Using Gulp build tool with this project

1. Fork the [repository](https://github.com/rogyw/ufend-P8-neighbourhood-map.git) on GitHub.
1. Use git to copy/clone your new repository to your local system.
1. Install or update [node.js and npm](https://nodejs.org/en/).
1. Install [gulp.js](http://gulpjs.com/) if not already in use.
1. Install all gulp packages used by project.
``` npm install --save-dev gulp-cssnano gulp-autoprefixer gulp-gh-pages gulp-uglify gulp-imagemin gulp-htmlmin run-sequence del```
1. (optional) Install jsDoc. Note that jsDoc needs to be run manually to generate code  documentation. ```npm install jsdoc```
1. Open your local console and change the current directory to the project root folder (and location of gulpfile.js). The subfolder `dist` contains the automatically generated optimised files.
1. To refresh the contents of `dist` folder use `gulp rebuild`.  the rebuild will delete the old dist folder and rebuild based on current source files.
1. To deploy the contents of `dist` folder to your live `gh-pages` for the repostitory on Github use `gulp deploy`
1. Test it worked!

##### Optimisations completed by Gulp
* gulp-cssnano - minify CSS files
* gulp-autoprefixer - auto-prefix CSS
* gulp-gh-pages - upload to gh-pages
* gulp-uglify  - minfy javascript files
* gulp-imagemin - reduce image sizes
* gulp-htmlmin  - minify html files
* run-sequence, del - used for project building

## Contacts

###Udacity
[Udacity website](https://www.udacity.com/)

###Roger Woodroofe
Contact Roger Woodroofe through [GitHub](https://github.com/rogyw) or email [rogyw@yahoo.co.nz](mailto:rogyw@yahoo.co.nz)
