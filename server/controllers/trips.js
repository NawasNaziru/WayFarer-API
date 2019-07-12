import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
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

export const createTrip = (req, res) => {
    var isAdmin;
    if (!req.body.origin || !req.body.destination || !req.body.status || !req.body.fare || !req.body.trip_date || !req.body.bus_id) {

        sendJSONresponse(res, 400, {
            status: 'error',
            error: 'origin, destination, status, fare, trip_date and bus_id are all required'
        });
        return;
    } else if (req.payload && req.payload.email) {
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
                        const userData = await client.query('SELECT * FROM users where email = $1', [req.payload.email]);
                        if (userData.rows.length === 0) {
                            sendJSONresponse(res, 404, {
                                status: 'error',
                                error: "User not found!"
                            });
                            return;
                        } else {
                            isAdmin = userData.rows[0].is_admin;
                            if (!isAdmin) {
                                sendJSONresponse(res, 403, {
                                    status: 'error',
                                    error: "Access denied. Sorry! You are not authorised to create a trip."
                                });
                                return;
                            } else {

                                const busId = req.body.bus_id;
                                const origin = req.body.origin;
                                const destination = req.body.destination;
                                const tripDate = req.body.trip_date;
                                const fare = req.body.fare;
                                const status = req.body.status;

                                const busData = await client.query('SELECT * FROM buses WHERE bus_id = $1', [req.body.bus_id]);
                                if (busData.rows.length === 0) {
                                    sendJSONresponse(res, 404, {
                                        status: 'error',
                                        error: "No such bus with that id exist! Check well!"
                                    });
                                    return;
                                } else {

                                    const query = {
                                        text: 'INSERT INTO trips(bus_id, origin, destination, trip_date, fare, status) VALUES( $1, $2, $3, $4, $5, $6) RETURNING *',
                                        values: [busId, origin, destination, tripDate, fare, status]
                                    }

                                    const tripData = await client.query(query);

                                    if (tripData.rows.length === 0) {
                                        sendJSONresponse(res, 500, {
                                            status: 'error',
                                            error: "Unexpected error encountered. Try again!"
                                        });
                                        return;
                                    } else {
                                        sendJSONresponse(res, 201, {
                                            status: 'success',
                                            data: tripData.rows[0]
                                        });
                                        return;
                                    }
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
                    return;
                });
            }
        });
        return;
    } else {
        sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
};


export const viewAllTrips = (req, res) => {
    if (req.payload && req.payload.email) {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                sendJSONresponse(res, 500, {
                    status: 'error',
                    error: 'Could not connect to database'
                });
                return;
            } else {
                (async () => {
                    try {
                        const usersData = await client.query('SELECT * FROM users where email = $1', [req.payload.email]);

                        if (usersData.rows.length > 0) {
                                const tripsData = await client.query('SELECT * FROM trips');

                                if (tripsData.rows.length === 0) {
                                    sendJSONresponse(res, 404, {
                                        status: 'error',
                                        error: "No trip found!"
                                    });
                                    return;
                                } else {
                                    sendJSONresponse(res, 200, {
                                        status: 'success',
                                        data: tripsData.rows

                                    });
                                }
                                return;
                            
                        } else {
                            sendJSONresponse(res, 404, {
                                status: 'error',
                                error: "User not found!"
                            });
                            return
                        }
                    } finally {
                        client.release();
                    }
                })().catch(err => {
                    sendJSONresponse(res, 500, {
                        status: 'error',
                        error: err.message
                    });
                    return;
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
    return;
};

export const cancelTrip = (req, res) => {
    var isAdmin;
    if (req.payload && req.payload.email) {
        if (!req.params.tripId) {
            sendJSONresponse(res, 400, {
                status: 400,
                error: 'You have not specified the trip in the params!',
            });
            return;
        } else {
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
                            const userData = await client.query('SELECT * FROM users where email = $1', [req.payload.email]);

                            if (userData.rows.length === 0) {
                                sendJSONresponse(res, 404, {
                                    status: 'error',
                                    error: "User not found!"
                                });
                                return;
                            } else {
                                isAdmin = userData.rows[0].is_admin;

                                if (!isAdmin) {
                                    sendJSONresponse(res, 403, {
                                        status: 'error',
                                        error: "Access denied. Sorry! You are not permitted to cancel a trip."
                                    });
                                    return;
                                } else {

                                    const query = {
                                        text: 'UPDATE trips SET status = $1 WHERE trip_id = $2 RETURNING *',
                                        values: ['cancelled', req.params.tripId]
                                    }

                                    const result = await client.query(query);

                                    if (result.rows.length === 0) {
                                        sendJSONresponse(res, 404, {
                                            status: 'error',
                                            error: "Trip not found!"
                                        });
                                        return;
                                    } else {
                                        sendJSONresponse(res, 200, {
                                            status: 'success',
                                            data: 'Trip cancelled successfully'
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
                        return;
                    });
                    return;
                }
            });
        }
    } else {
        sendJSONresponse(res, 404, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
}

