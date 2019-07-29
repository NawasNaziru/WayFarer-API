import "@babel/polyfill";
import express from 'express';
import * as ctrlAuth from '../controllers/authentication';
import * as ctrlTrips from '../controllers/trips';
import * as ctrlBookings from '../controllers/bookings';
import * as ctrlDocs from '../controllers/docs';
import auth from '../controllers/middleware';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// api documentation route
router.get('/docs', ctrlDocs.docV1);

// signup route
const signupfields = [check('first_name').not().isEmpty(), check('last_name').not().isEmpty(), check('email').not().isEmpty(), check('password').isLength({min: 1}).not().isEmpty()];
router.post('/auth/signup', signupfields, ctrlAuth.signup);

// sign in route
const signinfields = [check('email').not().isEmpty(), check('password').isLength({min: 1}).not().isEmpty()];
router.post('/auth/signin', signinfields, ctrlAuth.signin);

// trips routes
const tripCreationfields = [check('destination').not().isEmpty(), check('origin').not().isEmpty(), check('trip_date').not().isEmpty(), check('fare').not().isEmpty(), check('bus_id').not().isEmpty()];
router.post('/trips', auth, tripCreationfields, ctrlTrips.createTrip);
router.get('/trips', auth, ctrlTrips.viewAllTrips);
router.patch('/trips/:tripId', auth, ctrlTrips.cancelTrip);

// bookings routes
const bookingCreationfield = [check('trip_id').not().isEmpty()];
router.post('/bookings', auth, bookingCreationfield, ctrlBookings.createBooking);
router.get('/bookings', auth, ctrlBookings.viewBookings);
router.delete('/bookings/:bookingId', auth, ctrlBookings.deleteBooking);
const changeSeatfield = [check('seat_number').not().isEmpty()];
router.patch('/bookings/:bookingId', auth, changeSeatfield, ctrlBookings.changeSeat);


export default router;
