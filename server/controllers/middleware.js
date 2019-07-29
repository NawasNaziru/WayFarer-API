import "@babel/polyfill";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'express-jwt';

const auth = jwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'payload'
    });

export default auth;
