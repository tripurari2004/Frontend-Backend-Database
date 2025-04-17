mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    center: cord.geometry.coordinates , 
    zoom: 2
});

console.log(cord)
const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(cord.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<p>Exact Location will be provided after booking</p>`)
        .setMaxWidth("300px"))
        .addTo(map);