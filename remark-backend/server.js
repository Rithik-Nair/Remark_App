const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express App
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const driverRoutes = require('./routes/driverRoutes');
const rideRoutes = require('./routes/rideRoutes');

app.get('/', (req, res) => {
  res.send('Hello, Remark Backend is running!');
});

app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', rideRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
