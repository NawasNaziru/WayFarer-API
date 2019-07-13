require('dotenv').load();
const pg = require('pg');
const express = require('express');

// create tables

const config = {
    user: 'postgres',
    database: 'wayfarer-api-db',
    password: process.env.password,
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

if(process.env.NODE_ENV === 'production'){
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    })
  }

pool.connect((err, client, done) => {
    if (err) {
        console.log("not able to get connection due to " + err);
        return;
    }

    client.query('CREATE TABLE users(user_id SERIAL PRIMARY KEY, is_admin BOOLEAN not null DEFAULT = $1, email TEXT not null UNIQUE, first_name TEXT not null, last_name TEXT not null, salt TEXT not null UNIQUE, hash TEXT not null UNIQUE)', [false], (err, result) => {
        done(); // closing the connection;
        if (err) {
            console.log(err);

        }
        console.log(result);
    });

    client.query('CREATE TABLE buses(bus_id SERIAL PRIMARY KEY, number_plate TEXT not null UNIQUE, manufacturer TEXT not null, model  TEXT not null, year VARCHAR(4) not null, capacity INT not null)', (err, result) => {
        done(); // closing the connection;
        if (err) {
            console.log(err);
        }
        console.log(result);
    });

    client.query('CREATE TABLE trips(trip_id SERIAL PRIMARY KEY, bus_id INTEGER REFERENCES buses(bus_id) , origin TEXT not null, destination  TEXT not null, trip_date TIMESTAMP not null, fare REAL not null, status TEXT DEFAULT = $1 )', ['active'], (err, result) => {
        done(); // closing the connection;
        if (err) {
            console.log(err);
        }
        console.log(result);
    });

    client.query('CREATE TABLE bookings(booking_id SERIAL, trip_id INT REFERENCES trips(trip_id), user_id INT REFERENCES users(user_id), seat_number SERIAL, created_on  TIMESTAMP not null, PRIMARY KEY (trip_id, user_id))', (err, result) => {
        done(); // closing the connection;
        if (err) {
            console.log(err);
        }
        console.log(result);
    });

    client.on("error", err => {
        console.log(err.stack);
        return;
    });

});
