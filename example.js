// This is the html element you want to popup with id="elementID"
const popup = document.getElementById('elementID');
// This a div within htmlElem you want to change with id="divID"
const divElem = document.getElementById('divID');
// This is a button to close the popup
const closeButton = document.getElementById('closeButton');

// When you click on the data layer, do some action
map.on('click', 'mongoLayer', (e) => {
  // get marker coordinates
  const coordinates = e.features[0].geometry.coordinates.slice();
  const lon = coordinates[0];
  const lat = coordinates[1];

  // get marker properties
  const properties = e.features[0].properties;
  // This assigns the property in your schema with name "Property Name" to the variable property
  // so you can use it in your HTML element
  const property = properties['Property Name'];

  // Change the appearance of your popup before making it appear!
  // The elements in htmlElem that you want to change can be overwritten using innerHTML
  divElem.innerHTML(`<h1>Header</h1>`);
  // If you want to use your extracted properties you can do so here, it will basically read
  // as text in the function and innerHTML will create elements with your div as if you wrote 
  // it in HTML
  divElem.innerHTML(`<h1>${property}</h1>`);

  // Make your popup appear
  popup.classList.add('show')

  // Zoom to marker so your marker isn't hidden by any popups
  map.easeTo({
    center: coordinates,
    zoom: 14,
    duration: 1000
    })

});

map.on('click', closeButton, () => {
    popup.classList.remove('show');
})
