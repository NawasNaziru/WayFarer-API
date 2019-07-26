import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
const saltRounds = 10;

const helper = {
   sendJSONresponse(res, status, content){
        res.status(status);
        res.json(content);
    },
    generateJwt(id,email, firstName){
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 27);

        return jwt.sign({
            _id: id,
            email: email,
            name: firstName,
            exp: parseInt((expiry.getTime() / 1000), 10),
        }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
    },
    isValidPassword(password, storedHash, storedSalt){
        return bcrypt.hashSync(password, storedSalt) === storedHash;
    },
    getSalt(){
     return bcrypt.genSaltSync(saltRounds);
    },
    timeStamp(){
        return `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}  ${(new Date()).getHours() + 1}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`;
    },
    buildUpResponse(responseData, token){
        return {
            user_id: responseData.rows[0].user_id,
            is_admin: responseData.rows[0].is_admin,
            token: token,
            email: responseData.rows[0].email,
            first_name: responseData.rows[0].first_name,
            last_name: responseData.rows[0].last_name,
        }
    },
    fieldsValidator(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            helper.sendJSONresponse(res, 400, {
                status: 'error',
                error: `${errors.array()[0].param} is required `
            });
            return 1;
        }
        return;
        },
};

export default helper;