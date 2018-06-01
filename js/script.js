var map;
var trip;

var sidebar;
var peoplePane;
var routesPane;

var pins_template = Handlebars.compile(document.getElementById("pins-template").innerHTML);
var routes_template = Handlebars.compile(document.getElementById("routes-template").innerHTML);

function initMap() {
    map = L.map('map');
    map.setView([57.3619, -6.24727], 10);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);

    
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
            color: 'red',
            weight: 5,
            opacity: 0.7,
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
        L.marker(item_["location"], {
            icon: meetIcon,
            title: item_["name"],
            riseOnHover: true,
            pane: key
        }).addTo(map);
    }
}

function cleanApp(){
    if (typeof sidebar !== 'undefined') {
        sidebar.remove();
    }
}

function loadData() {
    trip = JSON.parse(_get("trip.json"));

    sidebar = L.control.sidebar({
        autopan: true,       // whether to maintain the centered map point when opening the sidebar
        closeButton: true,    // whether t add a close button to the panes
        position: 'left',     // left or right
    }).addTo(map);

    /* add an button with click listener */
    sidebar.addPanel({
        id: 'refresh',
        tab: '<i class="fas fa-sync"></i>',
        position: 'bottom',
        button: function (event) { 
            cleanApp();
            loadData(); 
        }
    });

    for(var key in trip) {
        obj = trip[key];
        if (obj["type"] === "pins") {
            loadPins(key, obj);
        }
        if (obj["type"] === "routes") {
            loadRoutes(key, obj);
        }
    }

    $(".locate-pin").click(function(evt){
        var currentTarget = $(evt.currentTarget);
        var data_person_id = currentTarget.attr("data-pin-id");
        var l = currentTarget.attr("data-pin-location");
        var location = l.split(',').map(function (v) { return parseFloat(v) });
        centerMap(map, location);
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
}

initMap();
loadData();

/* map.getPane('labels').style.display = 'none'; */