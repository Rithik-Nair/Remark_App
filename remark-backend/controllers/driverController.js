const pool = require('../db');
const bcrypt = require('bcrypt');

exports.updateLocation = async (req, res) => {
  const { userId, lat, lng } = req.body;
  try {
    await pool.query(
      `UPDATE users SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326) WHERE id = $3`,
      [lng, lat, userId]
    );
    res.json({ success: true, message: 'Location updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating location' });
  }
};

exports.registerDriver = async (req, res) => {
  const { name, email, phone, password, vehicle_number } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO drivers (name, email, phone, password, vehicle_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, hashedPassword, vehicle_number]
    );
    res.status(201).json({ message: 'Driver registered', driver: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
};

exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE email = $1', [email]);
    const driver = result.rows[0];

    if (!driver) return res.status(401).json({ error: 'Driver not found' });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', driver });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
