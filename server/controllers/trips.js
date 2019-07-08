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
  host: '127.0.0.1',
  database: 'wayfarer_api_db', 
  password: '', 
  port: 5432,
};
	
const pool = new pg.Pool(config);

export const createTrip =  (req, res) => {
  var isAdmin;
  if(req.payload && req.payload.email){
   pool.connect((err,client,done) => {
     if(err){
       sendJSONresponse(res, 500, {
         status: 'error',
         error: 'Could not connect to database'
       })
         return;
     } 
 
     client.query('SELECT * FROM users where email = $1', [req.payload.email], (err,responseData) => {
       done(); // closing the connection;
       if(err){
         sendJSONresponse(res, 500, {
           status: 'error',
           error: err.message
         })
           return;
       }
       if(responseData.rows.length === 0){
         sendJSONresponse(res,404, {
           status: 'error',
           error: "User not found!"
         } );
         return;
       }
 
     isAdmin = responseData.rows[0].is_admin;
 
     if(!isAdmin){
       sendJSONresponse(res,403, {
         status: 'error',
         error: "Access denied. Sorry! You are not authorised to create a trip."
       });
       return;
      }
      return;
   });
 
    const busId = req.body.bus_id;
    const origin = req.body.origin;
    const destination = req.body.destination;
    const tripDate = req.body.trip_date;
    const fare = req.body.fare;
    const status = req.body.status;
 
    const query = {
     text: 'INSERT INTO trips(bus_id, origin, destination, trip_date, fare, status) VALUES( $1, $2, $3, $4, $5, $6) RETURNING *',
     values: [busId, origin, destination, tripDate, fare, status]
   } 
 
   client.query(query).then(responseData => {
     if(responseData.rows.length === 0){
       sendJSONresponse(res,500, {
         status: 'error',
         error: "Unexpected error encountered. Try again!"
       } );
       return;
     }
     sendJSONresponse(res, 201, {
     status: 'success',
     data: responseData.rows[0]  
   });
   return;
 }
   ).catch(e => sendJSONresponse(res, 500, {
     status: 'error',
     error: e.message
   })
   );
    return;
   });
    return;
  }
 
  else{
   sendJSONresponse(res,404, {
     status: 'error',
     error: "User not found. Sign in or sign up again"
   });
   return;
  }
 };
 

 export const viewAllTrips = (req, res) => {
  if(req.payload && req.payload.email){
   pool.connect((err,client,done) => {
     if(err){
       sendJSONresponse(res, 500, {
         status: 'error',
         error: 'Could not connect to database'
       })
         return;
     } 
 
     client.query('SELECT * FROM users where email = $1', [req.payload.email], (err,responseData) => {
       done(); // closing the connection;
       
       if(responseData.rows.length === 0){
        sendJSONresponse(res,404, {
          status: 'error',
          error: "User not found!"
        } );
        return;
      }

       if(err){
         sendJSONresponse(res, 500, {
           status: 'error',
           error: err.message
         })
           return;
       }

   });

   client.query('SELECT * FROM trips', (err,responseData) => {
    done(); // closing the connection;

    if(err){
      sendJSONresponse(res, 500, {
        status: 'error',
        error: err.message
      })
        return;
    }

    if(responseData.rows.length === 0){
      sendJSONresponse(res,404, {
        status: 'error',
        error: "No trip found!"
      } );
      return;
    }
    sendJSONresponse(res, 200, {
      status: 'success',
      data: responseData.rows
      
    })
});

  })
}
else{
   sendJSONresponse(res,401, {
     status: 'error',
     error: "User not found. Sign in or sign up again"
   });
  return;
  }
 };


const Num_of_handlers = 3;
export default Num_of_handlers;
