mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates,
  zoom: 6,
});

// Create a marker and add it to the map.
new mapboxgl.Marker({
  color: "#3FB1CE",
  scale: 0.8,
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ closeButton: false, className: "popup" })
      .setHTML("<h1>Hello World!</h1>")
      .setMaxWidth("300px")
  )

  .addTo(map);

//   .setPopup(new mapboxgl.Popup()
//   .setHTML("<h1>Hello World!</h1>"))

//   .setPopup(new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
//   .setLngLat(e.lngLat)
//   .setHTML("<h1>Hello World!</h1>")
//   .setMaxWidth("300px")
//   .addTo(map)
//   )
