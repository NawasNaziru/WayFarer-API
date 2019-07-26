import helper from './helpers';
import db from '../models/index';

const tripBus = async (req, res, busId) => {
    try {
        const busData = await db.query('SELECT * FROM buses WHERE bus_id = $1', [busId]);
    return busData.rows.length;
    }
    catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: err.message
              })
              return;
          
      }
};

const storeTrip  = async (req, res, busId, origin, destination, tripDate, fare, status) => {
    try {
    const tripCreateQuery = 'INSERT INTO trips(bus_id, origin, destination, trip_date, fare, status) VALUES( $1, $2, $3, $4, $5, $6) RETURNING *';
    const tripInfo = [busId, origin, destination, tripDate, fare, status];

    const tripData = await db.query(tripCreateQuery, tripInfo);

    if (tripData.rows.length === 0) {
        helper.sendJSONresponse(res, 500, {
            status: 'error',
            error: "Unexpected error encountered. Try again!"
        });
        return;
    } else {
        
        helper.sendJSONresponse(res, 201, {
            status: 'success',
            data: tripData.rows[0]
        });
        return;
    }
    return;
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: "No bus with such id exist"
              })
              return;
          
      }
};

const proceedToCreateTrip = (req, res) => {     
               
    const busId = req.body.bus_id;
    const origin = req.body.origin;
    const destination = req.body.destination;
    const tripDate = req.body.trip_date;
    const fare = req.body.fare;
    const status = req.body.status;

    if (tripBus(req, res, busId) === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "No such bus with that id exist! Check well!"
        });
        return;
    } else {
      storeTrip(req, res, busId, origin, destination, tripDate, fare, status)
    }

}; 

const authUserAndCreateTrip = async (req, res) => {
    
    try {
        const userData = await db.query('SELECT * FROM users where email = $1', [req.payload.email]);
        if (userData.rows.length === 0) {
            helper.sendJSONresponse(res, 404, {
                status: 'error',
                error: "User not found!"
            });
            return;
        } else {
            const isAdmin = userData.rows[0].is_admin;
            if (!isAdmin) {
                helper.sendJSONresponse(res, 403, {
                    status: 'error',
                    error: "Access denied. Sorry! You are not authorised to create a trip."
                });
                return;
            } else {
             proceedToCreateTrip(req, res);
            }
        }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: err.message
              })
              return;    
      }
};

/* Controller for Creating a trip */
export const createTrip = (req, res) => {
    if (req.payload && req.payload.email) {
          if(helper.fieldsValidator(req, res)) return;
          authUserAndCreateTrip(req, res);  
    } else {
        helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
};

const filterTheTripsByOrigin = async (req, res) => {
    try {
        const tripsDataByOrigin = await db.query('SELECT * FROM trips WHERE origin = $1', [req.query.filterByOrigin]);

        if (tripsDataByOrigin.rows.length === 0) {
    helper.sendJSONresponse(res, 404, {
        status: 'error',
        error: "No trip found!"
    });
    return;
        } else {
         helper.sendJSONresponse(res, 200, {
        status: 'success',
        data: tripsDataByOrigin.rows

    })
}
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: err.message
              })
              return;
          
      }
}

const filterTheTripsByDestination = async (req, res) => {
 try {
     const tripsByDestination = await db.query('SELECT * FROM trips WHERE destination = $1', [req.query.filterByDestination]);
     if (tripsByDestination.rows.length === 0) {
      helper.sendJSONresponse(res, 404, {
        status: 'error',
        error: "No trip found!"
    });
    return;
    } else {
       helper.sendJSONresponse(res, 200, {
        status: 'success',
        data: tripsByDestination.rows

    })
}
return;
 }
 catch(err){
    helper.sendJSONresponse(res, 501, {
      status: 'Success',
      error: err.message
          })
          return;
      
  } 
}

const getAndSendRawTrips = async (req, res) => {
  try {
    const tripsData = await db.query('SELECT * FROM trips');

    if (tripsData.rows.length === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "No trip found!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 200, {
            status: 'success',
            data: tripsData.rows

        });
    }
    return;
  } catch(err){
    helper.sendJSONresponse(res, 501, {
      status: 'Success',
      error: err.message
          })
          return;
      
  }
}

const authUserAndGetAllTrips =  async (req, res) => {
    try {
        const usersData = await db.query('SELECT * FROM users where email = $1', [req.payload.email]);

        if (usersData.rows.length > 0) {
            if (req.query.filterByOrigin) {
                filterTheTripsByOrigin(req, res);
            }
            else if (req.query.filterByDestination) {
             filterTheTripsByDestination(req, res);
            }
            else {
                getAndSendRawTrips(req, res);
            }
            
        } else {
            helper.sendJSONresponse(res, 404, {
                status: 'error',
                error: "User not found!"
            });
            return
        }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: err.message
              })
              return;
          
      }
};

/* Controller for Viewing all Trips */
export const viewAllTrips = (req, res) => {
    if (req.payload && req.payload.email) {
          authUserAndGetAllTrips(req, res);  
    } else {
        helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: "User not found. Sign in or sign up again"
        });
        return;
    }
    return;
};

const proceedToCancelTrip = async (req, res) => {
    try {
    const tripCancelQuery = 'UPDATE trips SET status = $1 WHERE id = $2 RETURNING *';
    const tripInfo = ['cancelled', req.params.tripId];

    const result = await db.query(tripCancelQuery, tripInfo);

    if (result.rows.length === 0) {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: "Trip not found!"
        });
        return;
    } else {
        helper.sendJSONresponse(res, 200, {
            status: 'success',
            data: {
               message: 'Trip cancelled successfully'
            }
        });
        return;
    }
    } catch(err){
        helper.sendJSONresponse(res, 501, {
          status: 'Success',
          error: err.message
              })
              return;
          
      }
};

const authUserAndCancelTrip = async (req, res) => {
        try {
            const userData = await db.query('SELECT * FROM users where email = $1', [req.payload.email]);

            if (userData.rows.length === 0) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "User not found!"
                });
                return;
            } else {
               const isAdmin = userData.rows[0].is_admin;

                if (!isAdmin) {
                    helper.sendJSONresponse(res, 403, {
                        status: 'error',
                        error: "Access denied. Sorry! You are not permitted to cancel a trip."
                    });
                    return;
                } else {
                    proceedToCancelTrip(req, res);
                }
            }
        } catch(err){
            helper.sendJSONresponse(res, 501, {
              status: 'Success',
              error: err.message
                  })
                  return;
              
          }

};

/* Controller for Cancelling a trip */
export const cancelTrip = (req, res) => {
    var isAdmin;
    if (req.payload && req.payload.email) {
        if (!req.params.tripId) {
            helper.sendJSONresponse(res, 400, {
                status: 400,
                error: 'You have not specified the trip in the params!',
            });
            return;
        } else {
           authUserAndCancelTrip(req, res);
        }
    } else {
        helper.sendJSONresponse(res, 404, {
            status: 'error',
            error: err.message
        });
        return;
    }
}

