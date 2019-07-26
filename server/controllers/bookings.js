import helper from './helpers';
import db from '../models/index';

const getAndsendInsertedBooking = async (req, res) => {
   try {
    const bookingSelectQuery = 'SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id, trips.trip_date, bookings.seat_number, users.first_name, users.last_name, users.email, bookings.created_on FROM bookings INNER JOIN trips ON bookings.trip_id = trips.id  INNER JOIN users ON bookings.user_id = users.user_id WHERE users.user_id = $1 AND trips.id = $2';
    const bookingInfo = [req.payload._id, req.body.trip_id];
    const bookingData = await db.query(bookingSelectQuery, bookingInfo);

    if (bookingData.rows.length === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: " Some information got missing!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 201, {
            status: 'success',
            data: bookingData.rows[0]
        });
        return;
    }
  }
    catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: "Not found!"
              })
              return;
          
      }

};

const insertAndSendBooking = async (req, res) => {
    try {
    const tripId = req.body.trip_id;
    const userId = req.payload._id;
    const createdOn = helper.timeStamp();

    const bookingInsertQuery = 'INSERT INTO bookings(trip_id, user_id, created_on) VALUES( $1, $2, $3) RETURNING *';
    const bookingDetails = [tripId, userId, createdOn];

    const bookingInserted = await db.query(bookingInsertQuery, bookingDetails);
    if (bookingInserted.rows.length === 0) {
        helper.sendJSONresponse(res, 500, {
            status: 'error',
            error: "Unexpected error encountered. Try again!"
        });
        return;
    } else {
      getAndsendInsertedBooking(req, res);
    }
  } catch(err){
    helper.sendJSONresponse(res, 501, {
      status: 'Success',
      error: "The trip with that id does not exist"
          })
          return;
      
  }
};

const authUserAndCreateBooking = async (req, res) => {
        try {
            const text = 'SELECT * FROM users where email = $1';
            const values = [req.payload.email];
            const usersData = await db.query(text, values);
            if (usersData.rows.length === 0) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "User not found!"
                });
                return;
            } else {
                     insertAndSendBooking(req, res);
            }
        } catch(err){
            helper.sendJSONresponse(res, 501, {
              status: 'Success',
              error: "Not successful. Try again!"
                  })
                  return;
              
          }
}

/* Controller for Creating Bookings */
export const createBooking = (req, res) => {
    if (req.payload && req.payload.email) {
        if(helper.fieldsValidator(req, res)) return;              
        authUserAndCreateBooking(req, res);
    } else if (!req.payload || !req.payload.email) {
        helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: "User session not found. Sign in or sign up again"
        });
        return;
    }
    else {
        helper.sendJSONresponse(res, 500, {
            status: 'error',
            error: "An error occured. Sign in or sign up again"
        });
        return;
    }

}

 const getOnlyPersonalUserBookings = async (req, res, userData) => {     
    try {
    const bookingsSelectQuery = 'SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id, trips.trip_date, bookings.seat_number, users.first_name, users.last_name, users.email, bookings.created_on FROM bookings INNER JOIN trips ON bookings.trip_id = trips.id  INNER JOIN users ON bookings.user_id = users.user_id WHERE bookings.user_id = $1';
    const bookingsInfo = [userData.rows[0].user_id];
    const bookingsData = await db.query(bookingsSelectQuery, bookingsInfo);
    if (bookingsData.rows.length === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "No booking found!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 200, {
            status: 'success',
            data: bookingsData.rows
        });
        return;
    }
    return;

   } catch(err){
    helper.sendJSONresponse(res, 501, {
      status: 'Success',
      error: "Not found"
          })
          return;     
  }
 }

 const getAllBookings = async (req, res) => {
     try {
    const allbookingsSelQuery = 'SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id, trips.trip_date, bookings.seat_number, users.first_name, users.last_name, users.email, bookings.created_on FROM bookings INNER JOIN trips ON bookings.trip_id = trips.id  INNER JOIN users ON bookings.user_id = users.user_id';
    const bookings = await db.query(allbookingsSelQuery,[]);

    if (bookings.rows.length === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "No booking found!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 200, {
            status: 'success',
            data: bookings.rows

        });
    }
     } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: 'Not found!'
              })
              return;
          
      }
 }
const authUserAndGetBookings = async (req, res) => {
        try {
            const userSelectQuery = 'SELECT * FROM users where email = $1';
            const userInfo = [req.payload.email];
            const userData = await db.query(userSelectQuery, userInfo);
            if (userData.rows.length === 0) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "User not found!"
                });
                return;
            } else {
               const isAdmin = userData.rows[0].is_admin;

                if (!isAdmin) {
                  getOnlyPersonalUserBookings(req, res, userData);
                } else {
                   getAllBookings(req, res);
                }
                return;
            }
        } catch(err){
            helper.sendJSONresponse(res, 501, {
              status: 'Success',
              error: 'Not found'
                  })
                  return;
              
          }
};

/* Controller for viewing bookings */
export const viewBookings = (req, res) => {
    var isAdmin;
    if (req.payload && req.payload.email) {
         authUserAndGetBookings(req, res);  
    } else if (!req.payload || !req.payload.email) {
        helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
};

const removeBooking = async (req, res, userData) => {
    try {
    const bookingDeleteQuery = 'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *';
    const bookingInfo =  [req.params.bookingId, userData.rows[0].user_id];
    
    const result = await db.query(bookingDeleteQuery, bookingInfo);

    if (result.rows.length === 0) {
        helper.sendJSONresponse(res, 400, {
            status: 'error',
            error: "The booking doesn't belong to you or it doesn't exist!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 200, {
            status: 'success',
            data: {
                message: "Booking deleted successfully!"
            }
        });
        return;
    }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: "Booking not found"
              })
              return;
          
      }
};
const authUserAndRemoveBooking = async (req,res) => {
    try {
        const userData = await db.query('SELECT * FROM users where email = $1', [req.payload.email]);

        if (userData.rows.length === 0) {
            helper.sendJSONresponse(res, 404, {
                status: 'error',
                error: "User not found!"
            });
            return;
        } else {
          removeBooking(req,res, userData);
        }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: 'Booking doesnt exist'
              })
              return;
          
      }
};

/* Controller for deleting a booking */
export const deleteBooking = (req, res) => {
    if (req.payload && req.payload.email) {
        if (!req.params.bookingId) {
            helper.sendJSONresponse(res, 400, {
                status: 400,
                error: 'You have not specified the trip in the params!',
            });
            return;
        } else {
            authUserAndRemoveBooking(req,res);    
        }
    } else {
        helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
};

const proceedToChangeSeat = async (req, res, userData) => {
    try {
    const changeSeatQuery = 'UPDATE bookings SET seat_number = $1 WHERE id = $2 AND user_id = $3 RETURNING *';                          
    const bookingInfo = [req.body.seat_number, req.params.bookingId, userData.rows[0].user_id];    

    const response = await db.query(changeSeatQuery, bookingInfo);

    if (response.rows.length === 0) {
    helper.sendJSONresponse(res, 500, {
        status: 'error',
        error: "The booking doesn't belong to you or it doesn't exist!!"
    });
    return;
    } else {
    helper.sendJSONresponse(res, 201, {
        status: 'success',
        data: {
         message: 'Seat changed successfully'
        }
    });
    return;
    }
return;
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: 'That seat number is already taken by someone. Choose another!'
              })
              return;
          
      }

}

const authUserAndChangeSeat = async (req, res) => {
    try {
        const userData = await db.query('SELECT * FROM users where email = $1', [req.payload.email]);
        if (userData.rows.length === 0) {
            helper.sendJSONresponse(res, 404, {
                status: 'error',
                error: "User not found!"
            });
            return;
        } else {
            proceedToChangeSeat(req, res, userData);
        }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: 'Booking does not belong to you'
              })
              return;
          
      }
};

/* Controller for Changing Seat */
export const changeSeat = (req, res) => {
    
    if (req.payload && req.payload.email) {
        if(helper.fieldsValidator(req, res)) return;
        if(!req.params.bookingId) {
            helper.sendJSONresponse(res, 400, {
                status: 400,
                error: 'You have not specified the booking in the params!',
            });
            return;
        } else {
          authUserAndChangeSeat(req, res);
        }
    } else {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
};

