require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Resort API is running...');
});

app.get('/api/users', async (req, res, next) => {
  try {
    const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
    const result = email
      ? await pool.query(
        'SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
        [email]
      )
      : await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/users', async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get('/api/rooms', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/rooms', async (req, res, next) => {
  const { name, description, price, image_url } = req.body;
  const numericPrice = Number(price);

  if (!name || price === undefined || !Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: 'name and a non-negative numeric price are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO rooms (name, description, price, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || null, numericPrice, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get('/api/reservations', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT reservations.*, rooms.name AS room_name, users.name AS user_name
       FROM reservations
       JOIN rooms ON rooms.id = reservations.room_id
       JOIN users ON users.id = reservations.user_id
       ORDER BY reservations.check_in`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/reservations', async (req, res, next) => {
  const { user_id, room_id, check_in, check_out } = req.body;
  const userId = Number(user_id);
  const roomId = Number(room_id);
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);

  if (!Number.isInteger(userId) || !Number.isInteger(roomId) || !check_in || !check_out
    || Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())
    || checkOutDate <= checkInDate) {
    return res.status(400).json({
      error: 'user_id, room_id, check_in, and a check_out after check_in are required',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reservations (user_id, room_id, check_in, check_out)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, roomId, checkInDate.toISOString(), checkOutDate.toISOString()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === '23505') {
    return res.status(409).json({ error: 'A record with that unique value already exists' });
  }

  if (error.code === '23503') {
    return res.status(400).json({ error: 'A referenced user or room does not exist' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
