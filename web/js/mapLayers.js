// create a map object
var theMap = L.map('map_space', {
    center:[52.003, -3.808],
    zoom: 9
});

//I tried to add layers but it didn't work so need to re-visit.
//var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(theMap);

// determine what tiles to use for the base map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(theMap);

//var baseMaps = {
//    "OpenStreetMap": osm
//};

//create overlays object
//var overlayMaps = {
    //"All Accidents": cluster,
    //"School Accidents": schools
    //hospital accidents
    //accidents per km
//}

// single marker
// var marker1 = L.marker([51.5, -3.4]).addTo(theMap);

// cluster accident data (density)
// var clusterAll = L.markerClusterGroup();
// var markerAll = L.geoJSON(accidentCoords);
// clusterAll.addLayer(markerAll);
// var cluster = L.layerGroup([markerAll]);

//Schools as points with circles on each point
// var schoolsLayer = L.geoJSON(schoolGeoJson, {
//     onEachFeature: function (feature) {
//         let circleCoords = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates)    
//         L.circle(circleCoords, {radius: 500}).addTo(theMap)
//     }
// }).addTo(theMap);

//circle around a single school
//var schoolCircle = L.circle([51.5091, -3.2471], {radius: 200}).addTo(theMap);

//accidents inside school radius
//custom marker for accident markers
// var markerOptions = {
//     radius: 6,
//     fillColor: '#ef05f7',
//     color: '#000',
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.5
// };

// var schoolAccidents = L.geoJSON(schoolAccidents, {
//     pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, markerOptions);
//     }
// }).addTo(theMap);

//hospitals
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

var hospitalPoints = L.geoJSON(hospitalGeoJson, {
    pointToLayer: function (feature, latlng){
        return L.circle(latlng, {radius: 1000})
    }
})

theMap.addLayer(hospitalPoints);

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
})

theMap.addLayer(hospitalAccidents);

//when adding future layers adapt this code:
//layerControl.addOverlay(layerVariable, "Layer Name");
