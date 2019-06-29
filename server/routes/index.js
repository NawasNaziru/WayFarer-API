import express from 'express';

const router = express.Router();

import * as ctrlAuth from '../controllers/authentication'

import * as ctrlTrips from '../controllers/trips';

// signup route

router.post('/users/auth/signin', ctrlAuth.login);

// sign in route
router.post('/users/auth/signup', ctrlAuth.register);

// admin route
router.post('/trips', ctrlTrips.createTrip);


// admin and user route
router.get('/trips', ctrlTrips.viewAllTrips);

export default router;
