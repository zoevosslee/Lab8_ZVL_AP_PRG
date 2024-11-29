mapboxgl.accessToken = 'pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTE4OG1lNnQwOG5lMmpxMnRwNGZnb3drIn0.U_npUNUZEOSOXVi5-SWgHw';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // The ID of the map container
  style: {
    version: 8,
    sources: {
      'stadia-tiles': {
        type: 'raster',
        tiles: [
          `https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png?api_key=99e82fc4-ae1b-4d11-8f3e-1aebf67508f9`
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: 'stadia-tiles-layer',
        type: 'raster',
        source: 'stadia-tiles',
      },
    ],
  },
  center: [-73.935242, 40.730610], // Starting position [lng, lat]
  zoom: 12, // Initial zoom level
});

map.on('load', () => {
  // Add a GeoJSON source with data from the API
  map.addSource('mongoLayer', {
    type: 'geojson',
    data: 'https://paths-to-power-zvl-4288f0734099.herokuapp.com/api/geojson' // Replace with your API endpoint
  });

  // Add a layer to display MongoDB data with circle outline
  map.addLayer({
    id: 'mongoLayer',
    type: 'circle',
    source: 'mongoLayer',
    paint: {
      'circle-radius': 10,
      'circle-color': '#ffd500', // Fill color
      'circle-stroke-color': '#000000', // Outline color
      'circle-stroke-width': 0.5 // Outline width
    }
  });
});
