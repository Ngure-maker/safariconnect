-- Create the database (run manually if needed)
-- CREATE DATABASE safariconnect;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'receptionist' CHECK (role IN ('admin', 'guide', 'receptionist')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tourists (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  package_name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  activities_included TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  driver_assigned VARCHAR(255),
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accommodations (
  id SERIAL PRIMARY KEY,
  accommodation_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  available_rooms INT NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  tourist_id INT NOT NULL,
  package_id INT NOT NULL,
  destination_id INT NOT NULL,
  accommodation_id INT NOT NULL,
  vehicle_id INT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount DECIMAL(12, 2) NOT NULL,
  booking_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tourist_id) REFERENCES tourists(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  booking_id INT NOT NULL,
  tourist_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Mpesa', 'Visa', 'Mastercard', 'Cash', 'Bank Transfer')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (tourist_id) REFERENCES tourists(id) ON DELETE CASCADE
);

-- Trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['users', 'tourists', 'packages', 'vehicles', 'accommodations', 'bookings', 'payments'])
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_' || tbl || '_updated_at'
    ) THEN
      EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
    END IF;
  END LOOP;
END;
$$;

-- Seed data
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@safariconnect.com', '$2a$10$dummyhash', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO destinations (name, description) VALUES
('Maasai Mara', 'World-famous wildlife reserve known for the Great Migration'),
('Amboseli', 'Famous for large elephant herds and views of Mount Kilimanjaro'),
('Tsavo East', 'One of Kenya''s largest national parks with diverse wildlife'),
('Tsavo West', 'Known for Mzima Springs and volcanic landscapes'),
('Lake Nakuru', 'Famous for flamingos and bird watching'),
('Samburu', 'Unique wildlife in a semi-arid landscape'),
('Diani Beach', 'Beautiful white sand beach on the Indian Ocean coast'),
('Hell''s Gate', 'Dramatic cliffs and geothermal activity')
ON CONFLICT DO NOTHING;

INSERT INTO packages (package_name, duration, price, description, activities_included) VALUES
('3-Day Maasai Mara Safari', 3, 45000.00, 'Experience the wonders of Maasai Mara with game drives and cultural visits', 'Game drives, Maasai village visit, bush dinner'),
('5-Day Amboseli Experience', 5, 65000.00, 'Explore Amboseli National Park with stunning views of Kilimanjaro', 'Game drives, photography sessions, nature walks'),
('7-Day Coastal Adventure', 7, 85000.00, 'Relax and explore Kenya''s beautiful coastline', 'Snorkeling, beach activities, boat rides, cultural tours'),
('10-Day Kenya Wildlife Expedition', 10, 120000.00, 'Comprehensive safari covering multiple parks and reserves', 'Game drives, guided walks, bird watching, cultural experiences')
ON CONFLICT DO NOTHING;

INSERT INTO vehicles (vehicle_name, registration_number, capacity, driver_assigned, availability) VALUES
('Toyota Land Cruiser', 'KCB 001A', 7, 'John Kamau', TRUE),
('Safari Van', 'KCB 002B', 12, 'Peter Ochieng', TRUE),
('Toyota Prado', 'KCB 003C', 6, 'Mary Wanjiku', TRUE),
('Land Rover Defender', 'KCB 004D', 5, 'James Mwangi', TRUE)
ON CONFLICT (registration_number) DO NOTHING;

INSERT INTO accommodations (accommodation_name, location, price_per_night, available_rooms, rating) VALUES
('Sarova Mara Game Camp', 'Maasai Mara', 15000.00, 20, 4.5),
('Amboseli Serena Lodge', 'Amboseli', 12000.00, 15, 4.3),
('Sweetwaters Camp', 'Nanyuki', 10000.00, 25, 4.6),
('Diani Reef Resort', 'Diani Beach', 18000.00, 30, 4.4)
ON CONFLICT DO NOTHING;
