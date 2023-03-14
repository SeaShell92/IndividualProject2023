// determine what tiles to use for the base map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var humanOSM = L.tileLayer('https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var accidentsWMS = L.tileLayer.wms('https://ces-gis.southwales.ac.uk:2345/geoserver/wms', {
    layers: 's27:accidents_per_km',
    format: 'image/png',
    attribution: 'GeoServer: ces-gis'
});

// cluster accident data (density)
//the "default" state of the map when it loads in.
var clusterAll = L.markerClusterGroup();
var markerAll = L.geoJSON(accidentCoords);
clusterAll.addLayer(markerAll);
//make the clusters a layer
var cluster = L.layerGroup([clusterAll]);

// create a map object
var theMap = L.map( 'map_space', {
    center:[52.403, -3.808],
    zoom: 8,
    minZoom: 2,
    layers: [osm, cluster]
});

//custom marker for school points
var schoolIcon = L.icon({
    iconUrl: 'img/school-point.png',
    iconSize: [24, 24],
    iconAnchor: [11, 23]
});

//Schools as points 
var schoolsLayer = L.geoJSON(schoolGeoJson, {
    pointToLayer: function (feature, latlng){
        return L.marker(latlng, {icon: schoolIcon})
    }
});

//schools as circles, to show radius
var schoolCircles = L.geoJSON(schoolGeoJson, {
    pointToLayer: function (feature, latlng){
        return L.circle(latlng, {radius: 500})
    }
});

//accidents inside school radius (circle)
//custom marker for accident points
var markerOptions = {
    radius: 5,
    fillColor: '#ef05f7',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

var schoolAccidents = L.geoJSON(schoolAccidents, {
    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, markerOptions);
    }
});

//the school points, circles and accident points combine to become one layer
var schools = L.layerGroup([schoolsLayer, schoolCircles, schoolAccidents]);

//hospitals
//colour coded markers 
var slightMarker = {
    radius: 6,
    fillColor: 'green',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.25
};
var seriousMarker = {
    radius: 6,
    fillColor: '#fa9107',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};
var fatalMarker = {
    radius: 6,
    fillColor: 'red',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

//no marker on each hospital only the radius circle.
//base map usually has symbol for hospitals.
var hospitalPoints = L.geoJSON(hospitalGeoJson, {
    pointToLayer: function (feature, latlng){
        return L.circle(latlng, {radius: 1000})
    }
});

var hospitalAccidents = L.geoJSON(hospitalAccidents, {
    pointToLayer: function (feature, latlng){
        if (feature.properties.severity == 1){
            markerStyle = fatalMarker
        }
        else if (feature.properties.severity == 2){
            markerStyle = seriousMarker
        }
        else{
            markerStyle = slightMarker
        }
        return L.circleMarker(latlng, markerStyle);
    }
});

//the hospital circles and accident points inside the circles become one layer
var hospitals = L.layerGroup([hospitalPoints, hospitalAccidents]);

//use Layer Groups and Layer Control to allow user to switch between queries.
//base maps to be added to the control
var baseMapsObject = {
    "Open Street Map": osm,
    "Humanitarian Map": humanOSM
};

//create overlays object for the control
var overlayQueriesObject = {
    "All Accidents": cluster,
    "Accidents near Schools": schools,
    "Accidents near Hospitals": hospitals
    //accidents per km (WMS layer - see below)
};

var layerControl = L.control.layers(baseMapsObject, overlayQueriesObject).addTo(theMap);

//how to add future query to layer control instead of adding to object.
layerControl.addOverlay(accidentsWMS, "Accidents per km");
