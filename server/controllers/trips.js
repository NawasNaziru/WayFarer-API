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
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
	
const pool = new pg.Pool(config);

export const createTrip =  (req, res) => {
 
};

export const viewAllTrips = (req, res) => {
  
 };

const Num_of_handlers = 3;
export default Num_of_handlers;
