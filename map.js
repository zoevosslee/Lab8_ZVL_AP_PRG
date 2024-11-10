mapboxgl.accessToken = 'pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTE4OG1lNnQwOG5lMmpxMnRwNGZnb3drIn0.U_npUNUZEOSOXVi5-SWgHw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/zvl1215/cm1dtqpo000qf01qk450z2pv4', // Your custom style
  center: [-73.935242, 40.730610], // Starting position [lng, lat]
  zoom: 12
});

map.on('load', () => {
  // Add a GeoJSON source with data from the API
  map.addSource('mongoLayer', {
    type: 'geojson',
    data: 'http://localhost:3000/api/geojson' // Replace with your API endpoint
  });

  // Add a layer to display MongoDB data with circle outline
  map.addLayer({
    id: 'mongoLayer',
    type: 'circle',
    source: 'mongoLayer',
    paint: {
      'circle-radius': 10,
      'circle-color': '#ffd500',
      'circle-stroke-color': '#000000', // Outline color (black)
      'circle-stroke-width': .5 // Outline width
    }
  });
});
