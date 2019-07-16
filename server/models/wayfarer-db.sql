BEGIN;
CREATE TABLE users(user_id SERIAL PRIMARY KEY, is_admin BOOLEAN not null DEFAULT false, email TEXT not null UNIQUE, first_name TEXT not null, last_name TEXT not null, salt TEXT not null UNIQUE, hash TEXT not null UNIQUE);
CREATE TABLE buses(bus_id SERIAL PRIMARY KEY, number_plate TEXT not null UNIQUE, manufacturer TEXT not null, model  TEXT not null, year VARCHAR(4) not null, capacity INT not null);
CREATE TABLE trips(trip_id SERIAL PRIMARY KEY, bus_id INTEGER REFERENCES buses(bus_id) , origin TEXT not null, destination  TEXT not null, trip_date TIMESTAMP not null, fare REAL not null, status TEXT DEFAULT 'active');
CREATE TABLE bookings(booking_id SERIAL, trip_id INT REFERENCES trips(trip_id), user_id INT REFERENCES users(user_id), seat_number SERIAL, created_on  TIMESTAMP not null, PRIMARY KEY (trip_id, user_id));
INSERT INTO buses(number_plate, manufacturer, model, year, capacity) VALUES('H23652', 'Benz', 'Buccati', '2019', 7);
INSERT INTO users(is_admin, email, first_name, last_name, salt, hash ) VALUES (true, 'zabeed@outlook.com', 'zinel', 'abeed', '$2b$10$E2b5fl4RcZy0zg2WHxHLbO', '$2b$10$E2b5fl4RcZy0zg2WHxHLbOVU.2GaO9KXzxbvHCH7dgiBXLR.YbF7m');
COMMIT;