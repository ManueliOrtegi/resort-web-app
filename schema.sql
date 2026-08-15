CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'guest'
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  availability BOOLEAN DEFAULT true,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  check_in TIMESTAMP NOT NULL,
  check_out TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  CONSTRAINT reservation_dates_valid CHECK (check_out > check_in)
);

INSERT INTO rooms (name, description, price, image_url)
SELECT 'Oceanfront villa', 'Private pool · 2 guests', 680, 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=900&q=80'
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Oceanfront villa');

INSERT INTO rooms (name, description, price, image_url)
SELECT 'Garden suite', 'Outdoor shower · 3 guests', 420, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80'
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Garden suite');

INSERT INTO rooms (name, description, price, image_url)
SELECT 'Cliffside residence', 'Two bedrooms · 5 guests', 950, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80'
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = 'Cliffside residence');
