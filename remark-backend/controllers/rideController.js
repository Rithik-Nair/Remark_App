const pool = require('../db');

exports.requestRide = async (req, res) => {
  const { rider_id, pickup_location, dropoff_location, ride_type } = req.body;
  console.log('Rider request recieved:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO rides (rider_id, pickup_location, dropoff_location, ride_type, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [rider_id, pickup_location, dropoff_location, ride_type, 'requested']
    );
    res.status(201).json({ message: 'Ride requested', ride: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Ride request failed', details: err.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rides ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rides', details: err.message });
  }
};

exports.assignDriver = async (req, res) => {
  const { ride_id, driver_id } = req.body;

  if (!ride_id || !driver_id) {
    return res.status(400).json({ error: 'ride_id and driver_id are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE rides SET driver_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [driver_id, 'assigned', ride_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ message: 'Driver assigned', ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign driver', details: err.message });
  }
};

exports.updateRideStatus = async (req, res) => {
  const { ride_id, status } = req.body;
  console.log('Update ride status:', req.body);

  if (!ride_id || !status) {
    return res.status(400).json({ error: 'ride_id and status are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE rides SET status = $1 WHERE id = $2 RETURNING *',
      [status, ride_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ message: 'Ride status updated', ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};

exports.getRidesByDriver = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM rides WHERE driver_id = $1 ORDER BY id DESC',
      [driver_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch driver rides', details: err.message });
  }
};

exports.getRidesByRider = async (req, res) => {
  const { rider_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM rides WHERE rider_id = $1 ORDER BY id DESC',
      [rider_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rider rides', details: err.message });
  }
};

exports.assignDriverToRide = async (req, res) => {
  const rideId = req.params.id;
  const { driver_id } = req.body;

  try {
    // 1. Check if driver exists
    const driverCheck = await pool.query('SELECT * FROM drivers WHERE id = $1', [driver_id]);
    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // 2. Check if ride exists
    const rideCheck = await pool.query('SELECT * FROM rides WHERE id = $1', [rideId]);
    if (rideCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // 3. Assign driver
    const result = await pool.query(
      'UPDATE rides SET driver_id = $1, status = $2 WHERE id = $3 RETURNING *',
      [driver_id, 'assigned', rideId]
    );

    res.status(200).json({ message: 'Driver assigned successfully', ride: result.rows[0] });

  } catch (err) {
    res.status(400).json({ error: 'Failed to assign driver', details: err.message });
  }
};

