// Http requests
function _get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

// Map functions:
function centerMap(map, loc) {
    if(loc.length == 2) {
        map.flyTo(new L.LatLng(loc[0], loc[1]), 18);   
    }
    else if (loc.length == 4){
        var southWest = new L.LatLng(loc[0], loc[1]),
            northEast = new L.LatLng(loc[2], loc[3]);
        var bounds = L.latLngBounds(southWest, northEast);
        console.log(bounds)
        map.fitBounds(bounds, {
            paddingTopLeft:  L.point(400, 0)
        });
    }
}
