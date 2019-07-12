﻿import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';

let timeStamp = () => {
    return `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}  ${(new Date()).getHours() + 1}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`;
}

// Predefined generic function for server response in feature modules
const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};


const config = {
    user: 'postgres',
    database: 'wayfarer-api-db',
    password: process.env.password,
    port: 5432,
};


const pool = new pg.Pool(config);

export const createBooking = (req, res) => {
    if (!req.body.trip_id || !req.body.seat_number) {

        sendJSONresponse(res, 400, {
            status: 'error',
            error: 'origin, destination, status, fare, trip_date and bus_id are all required'
        });
        return;
    } 
    else if (req.payload && req.payload.email) {
        pool.connect((err, client, done) => {
            if (err) {
                sendJSONresponse(res, 500, {
                    status: 'error',
                    error: 'Could not connect to database'
                })
                return;
            } else {
                (async () => {
                    try {
                        const usersData = await client.query('SELECT * FROM users where email = $1', [req.payload.email]);

                        if (usersData.rows.length === 0) {
                            sendJSONresponse(res, 404, {
                                status: 'error',
                                error: "User not found!"
                            });
                            return;
                        } else {

                            const tripId = req.body.trip_id;
                            const userId = req.payload._id;
                            const seatNumber = req.body.seat_number;
                            const createdOn = timeStamp();

                            const query = {
                                text: 'INSERT INTO bookings(trip_id, user_id, seat_number, created_on) VALUES( $1, $2, $3, $4) RETURNING *',
                                values: [tripId, userId, seatNumber, createdOn]
                            }

                            const bookingInserted = await client.query(query);
                            if (bookingInserted.rows.length === 0) {
                                sendJSONresponse(res, 500, {
                                    status: 'error',
                                    error: "Unexpected error encountered. Try again!"
                                });
                                return;
                            } else {

                                const bookingData = await client.query('SELECT bookings.booking_id, bookings.user_id, bookings.trip_id, trips.bus_id, trips.trip_date, bookings.seat_number, users.first_name, users.last_name, users.email, bookings.created_on FROM bookings INNER JOIN trips ON bookings.trip_id = trips.trip_id  INNER JOIN users ON bookings.user_id = users.user_id WHERE users.user_id = $1 AND trips.trip_id = $2', [req.payload._id, req.body.trip_id]);

                                if (bookingData.rows.length === 0) {
                                    sendJSONresponse(res, 404, {
                                        status: 'error',
                                        error: " Some information got missing!"
                                    });
                                    return;
                                } else {
                                    sendJSONresponse(res, 201, {
                                        status: 'success',
                                        data: bookingData.rows[0]
                                    });
                                    return;
                                }
                            }
                        }
                    } finally {
                        client.release();
                    }
                })().catch(err => {
                    sendJSONresponse(res, 500, {
                        status: 'error',
                        error: err.message
                    });
                });
            }
        });
    } else {
        sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }

}
