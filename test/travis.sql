CREATE DATABASE travis_ci_test;
CREATE USER postgres WITH PASSWORD 'zazaa1992';
CREATE TABLE users(user_id SERIAL PRIMARY KEY, is_admin BOOLEAN, email TEXT not null UNIQUE, first_name TEXT not null, last_name TEXT not null, salt TEXT not null UNIQUE, hash TEXT not null UNIQUE);
CREATE TABLE buses(bus_id SERIAL PRIMARY KEY, number_plate TEXT not null UNIQUE, manufacturer TEXT not null, model  TEXT not null, year VARCHAR(4) not null, capacity INT not null);
CREATE TABLE trips(trip_id SERIAL PRIMARY KEY, bus_id INTEGER REFERENCES buses(bus_id) , origin TEXT not null, destination  TEXT not null, trip_date TIMESTAMP not null, fare REAL not null, status TEXT not null );
CREATE TABLE bookings(booking_id SERIAL, trip_id INT REFERENCES trips(trip_id), user_id INT REFERENCES users(user_id), created_on  TIMESTAMP not null, PRIMARY KEY (trip_id, user_id));
