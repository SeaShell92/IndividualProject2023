

var theMap = L.map('map_space', {
    center:[51.5, -3.4],
    zoom: 9
});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(theMap);

//var marker1 = L.marker([51.5, -3.4]).addTo(theMap);

var clusterAll = L.markerClusterGroup();
var markerAll = L.geoJSON(accidentCoords);
clusterAll.addLayer(markerAll);
theMap.addLayer(clusterAll);
