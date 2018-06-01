var meetIcon = L.icon({
    iconUrl: 'img/pins/meet.png',
    iconSize:     [22, 32], // size of the icon
    iconAnchor:   [11, 32], // point of the icon which will correspond to marker's location
});

var foodIcon = L.icon({
    iconUrl: 'img/pins/food.png',
    iconSize:     [22, 32], // size of the icon
    iconAnchor:   [11, 32], // point of the icon which will correspond to marker's location
});

var icon_dict = {
    "users":meetIcon,
    "utensils":foodIcon
}