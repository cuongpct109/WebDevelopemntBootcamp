mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: campground.geometry.coordinates,
  zoom: 6,
});

// Create a marker and add it to the map.
new mapboxgl.Marker({
  color: "#3FB1CE",
  scale: 1,
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ closeButton: false, className: "popup" })
      .setHTML(`<h2>${campground.title}</h2><h6>${campground.location}</h6>`)
      .setMaxWidth("300px")
  )

  .addTo(map);
