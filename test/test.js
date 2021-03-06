import "@babel/polyfill";
import assert from 'assert';
import chai from 'chai';
const should = chai.should();
const {
    expect
} = chai;
import chaiHttp from 'chai-http';
import app from '../server/app.js';

chai.use(chaiHttp);
describe('WayFarer API endpoints', () => {
    describe('User Operations', () => {
        it('Should sign up a user', (done) => {
            chai.request(app).keepOpen()
                .post('/api/v1/auth/signup')
                .send({
                    first_name: 'zinel',
                    last_name: 'abeed',
                    email: 'zabeed@outlook.com',
                    password: 'tycxcv&2',
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.be.a('string');
                });

            done();
        });

        it('Should sign in a user', (done) => {
            chai.request(app).keepOpen()
                .post('/api/v1/auth/signin')
                .send({
                    email: 'zabeed@outlook.com',
                    password: 'tycxcv&2',
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.data.should.be.a('object');
                    res.body.status.should.be.a('string');
                    res.body.data.first_name.should.equal('zinel');
                    res.body.data.last_name.should.equal('abeed');
                    res.body.data.email.should.equal('zabeed@outlook.com');
                    res.body.data.user_id.should.be.a('number');
                    res.body.data.token.should.be.a('string');
                });

            done();
        });

        it('Should create a booking for user', (done) => {
            chai.request(app).keepOpen()
                .post('/api/v1/bookings')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .send({
                    trip_id: 1,
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.data.should.be.a('object');
                    res.body.status.should.be.a('string');
                    res.body.data.id.should.be.a('number');
                    res.body.data.trip_id.should.be.a('number');
                    res.body.data.bus_id.should.be.a('number');
                    res.body.data.user_id.should.be.a('number');
                    res.body.data.trip_date.should.be.a('string');
                    res.body.data.seat_number.should.be.a('number');
                    res.body.data.created_on.should.be.a('string');
                    res.body.data.first_name.should.equal('zinel');
                    res.body.data.last_name.should.equal('abeed');
                    res.body.data.email.should.equal('zabeed@outlook.com');
                    res.body.data.is_admin.should.equal(true);
                });

            done();
        });

        it('Should change seat for user', (done) => {
            chai.request(app).keepOpen()
                .patch('/api/v1/bookings/1')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .send({
                    seat_number: 11,
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.be.a('string');
                    res.body.data.should.be.a('object');
                    res.body.status.should.equal('success');
                    res.body.data.message.should.equal('Seat changed successfully!');
                });

            done();
        });

        it('Should delete booking', (done) => {
            chai.request(app).keepOpen()
                .delete('/api/v1/bookings/1')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.be.a('string');
                    res.body.data.should.be.a('object');
                    res.body.status.should.equal('success');
                    res.body.data.message.should.equal('Booking deleted successfully!');
                });

            done();
        });
    });

    describe('Admin operations', () => {
        it('Should create a trip', (done) => {
            chai.request(app).keepOpen()
                .post('/api/v1/trips')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .send({
                    origin: 'Lagos',
                    destination: 'Abuja',
                    trip_date: '08-08-2019',
                    fare: 20080.95,
                    status: 'cancelled',
                    bus_id: 1
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.data.should.be.a('object');
                    res.body.status.should.be.a('string');
                    res.body.data.origin.should.equal('Lagos');
                    res.body.data.destination.should.equal('Abuja');
                    res.body.data.trip_date.should.equal('08-08-2019');
                    res.body.data.status.should.equal('cancelled');
                    res.body.data.fare.should.equal(20080.95);
                });

            done();
        });

        it('Should cancel a trip', (done) => {
            chai.request(app).keepOpen()
                .patch('/api/v1/trips/1')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.be.a('string');
                    res.body.data.should.be.a('object');
                    res.body.status.should.equal('success');
                    res.body.data.message.should.equal('Trip cancelled successfully!');
                });

            done();
        });
    });

    describe('Admin and user Operations', () => {
        it('Should get all trips', (done) => {
            chai.request(app).keepOpen()
                .get('/api/v1/trips')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.data.should.be.a('array');
                    res.body.status.should.be.a('string');
                    res.body.data[0].should.have.property('trip_id');
                    res.body.data[0].should.have.property('bus_id');
                    res.body.data[0].should.have.property('origin');
                    res.body.data[0].should.have.property('destination');
                    res.body.data[0].should.have.property('trip_date');
                    res.body.data[0].should.have.property('fare');
                    res.body.data[0].should.have.property('status');
                });

            done();
        });

        it('Should get bookings', (done) => {
            chai.request(app).keepOpen()
                .get('/api/v1/bookings')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjI4LCJlbWFpbCI6InphYmVlZEBvdXRsb29rLmNvbSIsImV4cCI6MTU2NDY4MDc4OCwiaWF0IjoxNTYyMzQ3OTg4fQ.r_knuY68jJQhaOh_cfyWB9U7YoGsaQmxYoU39XCkiz8')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.be.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.data.should.be.a('array');
                    res.body.status.should.be.a('string');
                    res.body.data[0].should.have.property('booking_id');
                    res.body.data[0].should.have.property('user_id');
                    res.body.data[0].should.have.property('bus_id');
                    res.body.data[0].should.have.property('trip_id');
                    res.body.data[0].should.have.property('trip_date');
                    res.body.data[0].should.have.property('seat_number');
                    res.body.data[0].should.have.property('first_name');
                    res.body.data[0].should.have.property('last_name');
                    res.body.data[0].should.have.property('email');
                });

            done();
        });
    });
});
