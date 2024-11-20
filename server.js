const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Use CORS to allow cross-origin requests
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://zvl:zoe@cluster0.auq90.mongodb.net/activism?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI).catch(error => console.error('MongoDB connection error:', error));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
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
}, { collection: 'activistdata' });

const GeoModel = mongoose.model('GeoCollection', geoSchema);

// API endpoint to get all GeoJSON data
app.get('/api/geojson', async (req, res) => {
  try {
    const features = await GeoModel.find();
    res.json({
      type: "FeatureCollection",
      features: features.map(feature => ({
        type: feature.type,
        properties: feature.properties,
        geometry: feature.geometry,
      })),
    });
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
