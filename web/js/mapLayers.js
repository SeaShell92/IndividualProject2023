// create a map object
var theMap = L.map('map_space', {
    center:[51.5, -3.4],
    zoom: 9
});

// determine what tiles to use for the base map
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(theMap);

// single marker
// var marker1 = L.marker([51.5, -3.4]).addTo(theMap);

// cluster accident data (density)
// var clusterAll = L.markerClusterGroup();
// var markerAll = L.geoJSON(accidentCoords);
// clusterAll.addLayer(markerAll);
// theMap.addLayer(clusterAll);

//Schools as points with circles on each point
var schoolsLayer = L.geoJSON(schoolGeoJson, {
    onEachFeature: function (feature) {
        let circleCoords = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates)    
        L.circle(circleCoords, {radius: 500}).addTo(theMap)
    }
});
theMap.addLayer(schoolsLayer);

//circle around a single school
//var schoolCircle = L.circle([51.5091, -3.2471], {radius: 200}).addTo(theMap);