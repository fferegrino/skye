var map;
var trip;

var sidebar;
var peoplePane;
var routesPane;

var people_template = Handlebars.compile(document.getElementById("people-template").innerHTML);
var routes_template = Handlebars.compile(document.getElementById("routes-template").innerHTML);

function initMap() {
    map = L.map('map');
    map.setView([57.3619, -6.24727], 10);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);

    peoplePane = map.createPane("people");
}

function loadRoutes(routes) {
    for(var route in routes) {
        var points = routes[route]["points"];
        var polyLine = points.map(function(point){
            return new L.LatLng(point[0], point[1]);
        });

        var firstpolyline = new L.Polyline(polyLine, {
            color: 'red',
            weight: 5,
            opacity: 0.7,
            smoothFactor: 1
        });
        firstpolyline.addTo(map);
    }

    var context = {routes: routes};
    var html = routes_template(context);

    routesPane = {
        id: 'routes',                     // UID, used to access the panel
        tab: '<i class="fa fa-map"></i>',  // content can be passed as HTML string,
        pane: html,        // DOM elements can be passed, too
        title: 'Routes',              // an optional pane header
    };
    sidebar.addPanel(routesPane);
}

function loadPeople(people) {
    var context = {people: people};
    var html = people_template(context);

    peoplePane = {
        id: 'people',                     // UID, used to access the panel
        tab: '<i class="fa fa-users"></i>',  // content can be passed as HTML string,
        pane: html,        // DOM elements can be passed, too
        title: 'People',              // an optional pane header
    };
    sidebar.addPanel(peoplePane);

    $(".locate-person").click(function(evt){
        var currentTarget = $(evt.currentTarget);
        var data_person_id = currentTarget.attr("data-person-id");
        var location = people[data_person_id]["location"];
        centerMap(map, location);
    });
    
    for (var person_id in people){
        var person = people[person_id];
        L.marker(person["location"], {
            icon: meetIcon,
            title: person["name"],
            riseOnHover: true,
            pane: 'people'
        }).addTo(map);
    }

    $("#view_people_chk").prop('checked', true);
    $("#view_people_chk").change(
        function(){
            if ($(this).is(':checked')) {
                map.getPane('people').style.display = 'block';
            } else {
                map.getPane('people').style.display = 'none';
            }
        });

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

    loadPeople(trip["people"]);
    loadRoutes(trip["routes"]);
}

initMap();
loadData();

/* map.getPane('labels').style.display = 'none'; */