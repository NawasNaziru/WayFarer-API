import assert from 'assert';
import chai from 'chai';
const should = chai.should();
const { expect } = chai;
import chaiHttp from 'chai-http';
import app from '../server/app.js';

chai.use(chaiHttp);
describe('WayFarer API endpoints', () => {
  describe('User Operations', () => {
    it('Should sign up a user', (done) => {
      chai.request(app).keepOpen()
        .post('/api/v1/users/auth/signup')
        .send({
          first_name: 'Ausat',
          last_name: 'Adam',
          email: 'ausatnaziru@gmail.com',
          password: '123456a',
          is_admin: false,
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
          res.body.data.first_name.should.equal('Ausat');
          res.body.data.last_name.should.equal('Adam');
          res.body.data.email.should.equal('ausatnaziru@gmail.com');
          res.body.data.is_admin.should.equal(false);
          res.body.data.user_id.should.be.a('number');
          res.body.data.token.should.be.a('string');
        });

      done();
    });

    it('Should sign in a user', (done) => {
      chai.request(app).keepOpen()
        .post('/api/v1/users/auth/signin')
        .send({
          email: 'nawasnaziru@outlook.com',
          password: 'xcxcxcv&2',
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
          res.body.data.first_name.should.equal('nawas');
          res.body.data.last_name.should.equal('adam');
          res.body.data.email.should.equal('nawasnaziru@outlook.com');
          res.body.data.is_admin.should.equal(false);
          res.body.data.user_id.should.be.a('number');
          res.body.data.token.should.be.a('string');
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
          status: 'cancelled'
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
  });

  describe('Admin and user Operations', () => {
    it('Should get all trips', (done) => {
      chai.request(app).keepOpen()
        .get('/api/v1/trips')
        .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOjYsImVtYWlsIjoicmljaEB3ZWFsdGguY29tIiwiZXhwIjoxNTYyODM0NzA4LCJpYXQiOjE1NjIyMjk5MDh9.GkjJafpNPCWQJP-WLV-jTeIHBYWXgE_4yQoLn3MXSiA')
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
  });
});


