var map;
var trip;

var sidebar;
var peoplePane;

function initMap() {
    map = L.map('map');
    map.setView([57.3619, -6.24727], 10);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);
    
    var marker = L.marker([51.2, 7]).addTo(map);
}

function loadPeople(people) {
    var person_source = document.getElementById("people-template").innerHTML;
    var template = Handlebars.compile(person_source);
    var context = {people: trip["people"]};
    var html = template(context);

    /* add a new panel */
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
        var location = trip["people"][data_person_id]["location"];
        centerMap(location);
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
}

function centerMap(loc) {
    map.flyTo(new L.LatLng(loc[0], loc[1]), 18);   
}

initMap();
loadData();