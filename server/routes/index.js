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

import * as ctrlBookings from '../controllers/bookings';

import * as ctrlDocs from '../controllers/docs';

// api documentation route
router.get('/docs', ctrlDocs.docV1);

// signup route

router.post('/auth/signup', ctrlAuth.signup);

// sign in route
router.post('/auth/signin', ctrlAuth.signin);

// trips routes
router.post('/trips', auth, ctrlTrips.createTrip);
router.get('/trips', auth, ctrlTrips.viewAllTrips);
router.patch('/trips/:tripId', auth, ctrlTrips.cancelTrip);

// bookings routes
router.post('/bookings', auth, ctrlBookings.createBooking);
router.get('/bookings', auth, ctrlBookings.viewBookings);
router.delete('/bookings/:bookingId', auth, ctrlBookings.deleteBooking);
router.patch('/bookings/:bookingId', auth, ctrlBookings.changeSeat);


export default router;
