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
          'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png?api_key=99e82fc4-ae1b-4d11-8f3e-1aebf67508f9'
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
  center: [-73.958009, 40.661899], // Starting position [lng, lat]
  zoom: 12.5, // Initial zoom level
});

// Add navigation controls
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// Load GeoJSON data and add to the map
map.on('load', () => {
  const geojsonEndpoint = 'https://paths-to-power-zvl-4288f0734099.herokuapp.com/api/geojson';

  fetch(geojsonEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.features && data.features.length > 0) {
        console.log('GeoJSON data loaded successfully:', data);

        // Add GeoJSON source
        map.addSource('mongoLayer', {
          type: 'geojson',
          data: data,
        });

        // Add a layer to display MongoDB data with circle outline
        map.addLayer({
          id: 'mongoLayer',
          type: 'circle',
          source: 'mongoLayer',
          paint: {
            'circle-radius': 12,
            'circle-color': '#ffd500', // Fill color
            'circle-stroke-color': '#000000', // Outline color
            'circle-stroke-width': 0.5, // Outline width
          },
        });

        // Add popup interaction
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'custom-popup', // Custom class for styling
        });

        map.on('mouseenter', 'mongoLayer', (e) => {
          map.getCanvas().style.cursor = 'pointer';

          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          // Set the popup content to display only the site name
          popup.setLngLat(coordinates)
            .setHTML(`<h3>${properties.Location || 'No information available'}</h3>`)
            .addTo(map);
        });

        map.on('mouseleave', 'mongoLayer', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

      // Remove the simple click listener and add a dynamic one
map.on('click', 'mongoLayer', (e) => {
  // Get the properties of the clicked point
  const properties = e.features[0].properties;

  // Get the "Page" property from the GeoJSON data
  const page = properties.Page;

  // Ensure the "Page" property exists and redirect to it
  if (page) {
    window.location.href = page; // Redirect to the page specified in the property
  } else {
    console.error('No "Page" property found for this point.');
    alert('No page available for this point.');
  }
});
      } else {
        console.error('GeoJSON data is empty or invalid.');
      }
    })
    .catch(error => {
      console.error('Failed to load GeoJSON data:', error);
    });
});

map.on('mousemove', 'mongoLayer', (e) => {
  if (e.features.length > 0) {
    const feature = e.features[0];

    // Get the id of the hovered feature
    const featureId = feature.properties.id;

    // Remove highlight from all links
    document.querySelectorAll('.link.highlight').forEach((link) => {
      link.classList.remove('highlight');
    });

    // Highlight the corresponding link
    const link = document.getElementById(featureId);
    if (link) {
      link.classList.add('highlight');
    }
  }
});

// Log successful map load
map.on('load', () => {
  console.log('Map loaded successfully!');
});

// Log map errors
map.on('error', (error) => {
  console.error('Map error:', error);
});
