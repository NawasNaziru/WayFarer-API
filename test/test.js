import assert from 'assert';
import chai from 'chai';
const should = chai.should();
const { expect } = chai;
import chaiHttp from 'chai-http';
import app from '../server/app.js';

const accountNumber = 2000000000;

chai.use(chaiHttp);
describe('WayFarer API endpoints', () => {
  describe('User Operations', () => {
    it('Should sign up a user', (done) => {
      chai.request(app).keepOpen()
        .post('/auth/signup')
        .send({
          firstName: 'Ausat',
          lastName: 'Adam',
          email: 'ausatnaziru@gmail.com',
          password: '123456a',
          id: 6,
          isAdmin: false,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          res.body.should.be.a('object');
        });

      done();
    });

    it('Should sign in a user', (done) => {
      chai.request(app).keepOpen()
        .post('/auth/signin')
        .send({
          email: 'nawasnaziru@gmail.com',
          password: '123456',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          res.body.should.be.a('object');
        });

      done();
    });
  });

  describe('Admin operations', () => {
    it('Should create a trip', (done) => {
      chai.request(app).keepOpen()
        .post('/trips')
        .send({ 
                 ​id ​ :​ ​ 4 ,  
                 bus_id ​ :​ ​8 ,   
                 ​origin ​ :​ ​Abuja​,
                 ​destination​ :​ ​ Lagos ,   
                 ​trip_date ​ :​ ​ "01-07-2019" ,
                 fare ​ :​ ​ 10000 ,   
                 ​status ​ :​ ​ active​,  
                })
                .end((err, res) => {
          res.should.have.status(201);
          expect(res).to.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('bus_id');
          res.body.data.should.have.property('origin');
          res.body.data.should.have.property('destination');
          res.body.data.should.have.property('trip_date');
          res.body.data.should.have.property('fare');
          res.body.data.status.should.be.a('string');
          res.body.data.fare.should.equal(10000);
        });

      done();
    });
  });

  describe('Admin and user Operations', () => {
    it('Should get all trips', (done) => {
      chai.request(app).keepOpen()
        .get('/trips')
        .end((err, res) => {
          res.should.have.status(201);
          expect(res).to.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('origin');
          res.body.data.should.have.property('destination');
        });

      done();
    });
  });
});
