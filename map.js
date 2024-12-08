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
    .then(response => response.json())
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
          interactive: true,
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
            .setHTML(`
                <h3>${properties.Location || 'No information available'}</h3>
            `)
            .addTo(map);
        });

        map.on('mouseleave', 'mongoLayer', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        // Add click interaction to navigate to a local HTML page
        map.on('click', 'mongoLayer', (e) => {
          const properties = e.features[0].properties;
          console.log('Feature properties:', properties);

          // Assume each feature has a `page` property in its GeoJSON properties for the relative file path
          const page = properties.page; // Replace with your actual property name for the file path

          if (page) {
            console.log(`Redirecting to page: ${page}`);
            // Redirect to the specific HTML page (relative path)
            window.location.href = page;
          } else {
            console.error('No page defined for this feature.');
          }
        });
      } else {
        console.error('No features found in the GeoJSON data.');
      }
    })
    .catch(err => {
      console.error('Error fetching GeoJSON data:', err);
    });
});

map.on('load', () => {
  console.log('Map loaded successfully!');
  console.log('Style:', map.getStyle());
});

map.on('error', (error) => {
  console.error('Map error:', error);
});
