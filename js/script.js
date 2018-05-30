var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var sidebar;

function initMap() {
    var map = L.map('map');
    map.setView([57.3619, -6.24727], 9);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);

    var marker = L.marker([51.2, 7]).addTo(map);

    sidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: true,    // whether t add a close button to the panes
        //container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    }).addTo(map);

        /* add a new panel */
    var panelContent = {
        id: 'userinfo',                     // UID, used to access the panel
        tab: '<i class="fa fa-info"></i>',  // content can be passed as HTML string,
        //pane: someDomNode.innerHTML,        // DOM elements can be passed, too
        title: 'Your Profile',              // an optional pane header
        position: 'bottom'                  // optional vertical alignment, defaults to 'top'
    };
    sidebar.addPanel(panelContent);

    /* add an button with click listener */
    sidebar.addPanel({
        id: 'click',
        tab: '<i class="fas fa-thumbs-up"></i>',
        button: function (event) { console.log(event); }
    });

    
}

initMap();