const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://zvl:zoe@cluster0.auq90.mongodb.net/activism?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema for GeoJSON data
const geoSchema = new mongoose.Schema({
  type: { type: String, default: "Feature" },
  properties: { type: Object },
  geometry: {
    type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
    coordinates: { type: [Number], required: true }
  }
}, { collection: 'activistdata' }); // My files come from the Stations folder, so enhance navigation to help find them

const GeoModel = mongoose.model('GeoCollection', geoSchema);

// API endpoint to get all GeoJSON data
app.get('/api/geojson', async (req, res) => {
  try {
    const features = await GeoModel.find();
    res.json({
      type: "FeatureCollection",
      features: features
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


