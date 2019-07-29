import "@babel/polyfill";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import helper from './helpers';
import db from '../models/index';

const sendUserData = (req, res, responseData, email, firstName) => {
            const userId = responseData.rows[0].user_id;
            const token = helper.generateJwt(userId, email, firstName);
            helper.sendJSONresponse(res, 201, {
                status: 'success',
                data : helper.buildUpResponse(responseData, token)
            })
 };

 /* Sign up controller */
export const signup = async (req, res) => {

    if(helper.fieldsValidator(req, res)) return;

    const salt = helper.getSalt();
    const hash = bcrypt.hashSync(req.body.password, salt);
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    const userCreateQuery = 'INSERT INTO users(email, first_name, last_name, salt, hash) VALUES( $1, $2, $3, $4, $5) RETURNING *';
    const userInfo = [email, firstName, lastName, salt, hash];

        try {            
            const responseData = await db.query(userCreateQuery, userInfo);           
            if (responseData.rows.length === 0) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "Unsuccessful. Try again!"
                });
                return;
            }
          sendUserData(req, res, responseData, email, firstName);
        }
        catch(err){
          helper.sendJSONresponse(res, 201, {
            status: 'Success',
            data: {
               message: "This email has already been registered. Choose other one!"
            }
                })
                return;
            
        }
    
}

const sendLoggedInUserData = (req, res, responseData) => {
            const userId = responseData.rows[0].user_id;
            const token = helper.generateJwt(userId, req.body.email, req.body.first_name);

            const savedSalt = responseData.rows[0].salt;
            const savedHash = responseData.rows[0].hash;

            if (!helper.isValidPassword(req.body.password, savedHash, savedSalt)) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "Invalid password. Provide your correct password"
                });
                return;
            }

            helper.sendJSONresponse(res, 200, {
                status: 'success',
                data : helper.buildUpResponse(responseData, token)
            }) ;
}

/* Sign in controller */
export const signin = async (req, res) => {
    if(helper.fieldsValidator(req, res)) return;
    const userSelectQuery = 'SELECT * FROM users where email = $1';
    const  userInfo = [req.body.email];
      try{
       const responseData = await db.query(userSelectQuery, userInfo);       
            if (responseData.rows.length === 0) {
                helper.sendJSONresponse(res, 404, {
                    status: 'error',
                    error: "Invalid email. Sign up first!"
                });
                return;
            }
            sendLoggedInUserData(req, res, responseData);
        }
        catch(err){
            helper.sendJSONresponse(res, 501, {
              status: 'error',
              data: "User not found!"
                  })
                  return;
              
          }
}
