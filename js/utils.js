// Http requests
function _get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    try {
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
        return Httpreq.responseText;  
    }
    catch(err) {
        return "";
    }        
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

// https://stackoverflow.com/a/901144/605482
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}