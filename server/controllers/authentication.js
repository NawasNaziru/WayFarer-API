import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pg from 'pg';
import { getMaxListeners } from 'cluster';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// Predefined generic function for server response in feature modules

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};


const config = {
  user: 'postgres',
  database: 'wayfarer_api_db', 
  password: '', 
  port: PGPORT, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
	
const pool = new pg.Pool(config);
 

export const signup = (req, res) => {

  if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      status: 'error',
      error: 'Requires your first name, last name, email and password!',
    });
    return;
  }

  const generateJwt = id => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 27);
  
    return jwt.sign({
      _id: id,
      email: req.body.email,
      name: req.body.firstName,
      exp: parseInt((expiry.getTime() / 1000), 10),
    }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };
  
  const hash = bcrypt.hashSync(req.body.password, salt);

  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const isAdmin = req.body.is_admin === 'true' ? true: false; //convert string to boolean.

  const query = {
    text: 'INSERT INTO users(is_admin, email, first_name, last_name, salt, hash) VALUES( $1, $2, $3, $4, $5, $6) RETURNING *',
    values: [isAdmin, email, firstName, lastName, salt, hash]
  }

  pool.connect((err,client,done) => {
    if(err){
      sendJSONresponse(res, 501, {
        status: 'error',
        error: 'Could not connect to database'
      })
        return;
    } 
    client.query(query).then(responseData => {
      if(responseData.rows.length === 0){
        sendJSONresponse(res,404, {
          status: 'error',
          error: 'Unsuccessful. Try again!'
        } );
        return;
      }
      const userId = responseData.rows[0].user_id;
      const token = generateJwt(userId);
      sendJSONresponse(res, 201, {
      status: 'success',
      data: {
        user_id: responseData.rows[0].user_id,
        is_admin: responseData.rows[0].is_admin,
        token: token,
        email: responseData.rows[0].email,
        first_name: responseData.rows[0].first_name,
        last_name: responseData.rows[0].last_name,
      }
    })
  }
    ).catch(e => sendJSONresponse(res, 500, {
      status: 'error',
      error: 'Already signed up. Sign in instead'
    })
    );

 });
}

export const signin = (req, res) => {
  if (!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      status: 'error',
      error: 'Requires your email and password',
    });
    return;
  }

  const generateJwt = id => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 27);
  
    return jwt.sign({
      _id: id,
      email: req.body.email,
      name: req.body.firstName,
      exp: parseInt((expiry.getTime() / 1000), 10),
    }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };

  const isValidPassword = (password, storedHash, storedSalt) => {
     return bcrypt.hashSync(password, storedSalt) === storedHash;
  }

  pool.connect((err,client,done) => {
    if(err){
      sendJSONresponse(res, 500, {
        status: 'error',
        error: 'Could not connect to database'
      })
        return;
    } 

    client.query('SELECT * FROM users where email = $1', [req.body.email], (err,responseData) => {
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
          error: "Invalid email. User not found. Sign up first!"
        } );
        return;
      }
      
      const userId = responseData.rows[0].user_id;
      const token = generateJwt(userId);

      const savedSalt = responseData.rows[0].salt;
      const savedHash = responseData.rows[0].hash;
      
      if(!isValidPassword(req.body.password, savedHash, savedSalt)){
        sendJSONresponse(res,404, {
          status: 'error',
          error: "Invalid password. Provide your correct password"
        } );
        return;
      }

      sendJSONresponse(res, 200, {
      status: 'success',
      data: {
        user_id: responseData.rows[0].user_id,
        is_admin: responseData.rows[0].is_admin,
        token: token,
        email: responseData.rows[0].email,
        first_name: responseData.rows[0].first_name,
        last_name: responseData.rows[0].last_name, 
      }
    })
  });
  });

 };
