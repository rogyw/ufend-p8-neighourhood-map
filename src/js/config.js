/*
 * =======================================================
 * app-config.js
 *  - contains configuration for
 *  https://github.com/rogyw/ufend-p8-neighbourhood-map
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 * https://github.com/rogyw
 * =======================================================
 */

"use strict";

/* ======================================================= */
/* Constants */
/* ======================================================= */
// Note: currently using var instead of const for compatibilty

var DEFAULT_MAP_CENTRE = { lat: -36.9001229, lng: 174.7826388 },
	DEFAULT_MAP_ZOOM = 11,
	DEFAULT_ZOOM_MAX = 16,
	MAP_MARKER_ICON = "img/marker-o-flag.png",
	MAP_INFOBUBBLE_WIDTH_MAX = 250,
	AJAX_API_TIMEOUT = 10000,
	APP_LOAD_TIMEOUT = 15000,
	API_ATAPI_STOP_DISTANCE = 1000,
	API_ATAPI_SECRET_KEY = "66ea2049-30bf-4ce3-bd6b-701e458de648",
	API_ATAPI_LOGO = "https://at-api.aucklandtransport.govt.nz/imageresizer/website/logo.png?width=55",
	API_ATAPI_WEBSITE = "https://at.govt.nz",
	MAX_BUSSTOPS = 8,
	IMAGE_LOGO_AK_SUMMERNAV = "img/logo-summernav-sml.png";

var DEBUG = false;
