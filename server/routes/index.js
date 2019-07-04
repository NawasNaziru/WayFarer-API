import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'express-jwt';
const router = express.Router();

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
  });

import * as ctrlAuth from '../controllers/authentication';

import * as ctrlTrips from '../controllers/trips';

// signup route

router.post('/users/auth/signup', ctrlAuth.signup);

// sign in route
router.post('/users/auth/signin', ctrlAuth.signin);

// admin route
router.post('/trips', auth, ctrlTrips.createTrip);


// admin and user route
router.get('/trips', auth, ctrlTrips.viewAllTrips);

export default router;
