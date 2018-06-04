var map;
var trip;

var sidebar;
var peoplePane;
var routesPane;

var pins_template = Handlebars.compile(document.getElementById("pins-template").innerHTML);
var routes_template = Handlebars.compile(document.getElementById("routes-template").innerHTML);
var panel_template = Handlebars.compile(document.getElementById("panel-template").innerHTML);



var last_route_color;

function initMap() {
    map = L.map('map');
    map.setView([57.3619, -6.24727], 10);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);

    
}

function loadPanel(key, data) {

    var result = data["content"];
    if ("is_markdown" in data && data["is_markdown"]) {
        var md = window.markdownit();
        result = md.render(data["content"]);
    }

    var context = {key: key, content: result};
    var html = panel_template(context );
    
    routesPane = {
        id: key,                     // UID, used to access the panel
        tab: '<i class="fa fa-' + data['icon'] + '"></i>',  // content can be passed as HTML string,
        pane: html,        // DOM elements can be passed, too
        title: data["name"],              // an optional pane header
    };
    sidebar.addPanel(routesPane);   
}

function loadRoutes(key, data) {
    var routes = data["routes"];
    var context = {key: key, routes: routes};
    var html = routes_template(context);

    if (map.getPane(key) === undefined) {
        map.createPane(key)
    }

    for(var route in routes) {
        var points = routes[route]["points"];
        var polyLine = points.map(function(point){
            return new L.LatLng(point[0], point[1]);
        });

        var firstpolyline = new L.Polyline(polyLine, {
            color: routes[route]['color'],
            className: "route c_" + route,
            weight: 6,
            opacity: 0.3,
            smoothFactor: 1,
            pane: key
        });
        firstpolyline.addTo(map);
    }

    routesPane = {
        id: key,                     // UID, used to access the panel
        tab: '<i class="fa fa-' + data['icon'] + '"></i>',  // content can be passed as HTML string,
        pane: html,        // DOM elements can be passed, too
        title: data["name"],              // an optional pane header
    };
    sidebar.addPanel(routesPane);
}

function loadPins(key, data) {
    var items = data["pins"]
    var context = {key: key, items: items};
    var html = pins_template(context);
    if (map.getPane(key) === undefined) {
        map.createPane(key)
    }

    var peoplePanel = {
        id: key,                     // UID, used to access the panel
        tab: '<i class="fa fa-' + data['icon'] + '"></i>',  // content can be passed as HTML string,
        pane: html,        // DOM elements can be passed, too
        title: data['name'],              // an optional pane header
    };
    sidebar.addPanel(peoplePanel);
    
    for (var person_id in items){
        var item_ = items[person_id];

        var pin_props = {
            title: item_["name"],
            riseOnHover: true,
            pane: key
        };
        
        if(data['icon'] in icon_dict) {
            pin_props["icon"] = icon_dict[data['icon']]
        }

        var pin = L.marker(item_["location"], pin_props)
        pin.bindPopup(item_["name"]);
        pin.addTo(map);
    }
}

function cleanApp(){
    if (typeof sidebar !== 'undefined') {
        sidebar.remove();
    }
}

function loadData() {
    
    var url = getParameterByName("trip") || "http://localhost:4000/trip.json";
    json_string = _get(url);
    if(json_string ==""){
        alert(url + " does not contain a valid trip file");
        return false;
    }
    trip = JSON.parse(json_string);

    sidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: true,    // whether t add a close button to the panes
        position: 'left',     // left or right
    }).addTo(map);

    for(var key in trip) {
        obj = trip[key];
        if (obj["type"] === "pins") {
            loadPins(key, obj);
        }
        else if (obj["type"] === "routes") {
            loadRoutes(key, obj);
        }
        else if (obj["type"] === "panel") {
            loadPanel(key, obj);
        }
    }

    $(".locate-pin").click(function(evt){
        var currentTarget = $(evt.currentTarget);
        var data_person_id = currentTarget.attr("data-pin-id");
        var l = currentTarget.attr("data-pin-location");
        var location = l.split(',').map(function (v) { return parseFloat(v) });
        centerMap(map, location);
    });

    $(".locate-route").click(function(evt){
        var currentTarget = $(evt.currentTarget);
        var data_person_id = currentTarget.attr("data-route-id");
        var l = currentTarget.attr("data-route-bounds");
        var location = l.split(',').map(function (v) { return parseFloat(v) });
        centerMap(map, location);
    });

    $("article[class*=route-container]").hover(function(evt){
        var route_id = $(this).attr("data-route-id");

        $(".route").addClass("route-hidden");
        $(".c_" + route_id).removeClass("route-hidden");
        $(".c_" + route_id).addClass("route-highlighted");

    },function(evt){
        var route_id = $(this).attr("data-route-id");
        $(".route").removeClass("route-hidden");
        $(".c_" + route_id).removeClass("route-highlighted");
        
    });

    $("input[type=checkbox]").prop('checked', true);
    $("input[type=checkbox]").change(
        function(){
            var checkbox = $(this)
            var pane_id = checkbox.attr("data-pane-id")
            if (checkbox.is(':checked')) {
                map.getPane(pane_id).style.display = 'block';
            } else {
                map.getPane(pane_id).style.display = 'none';
            }
        });
    return true;
}

initMap();
loadData();

/* map.getPane('labels').style.display = 'none'; */