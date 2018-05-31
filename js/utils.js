// Http requests
function _get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

// Map functions:
function centerMap(map, loc) {
    map.flyTo(new L.LatLng(loc[0], loc[1]), 18);   
}
