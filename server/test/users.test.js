'use strict';
// set env variable to test
process.env.NODE_ENV = 'test';

// export env variables
require('dotenv').config({ path: '../.env'});

// require dev dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const http = require('http');

// require app
const app = require('../app');

// start test server on port 3001
const server = http.createServer(app);

// require User model
const models = require('../models');
const User = models.User;
const sequelize = models.sequelize;


describe('Users', () => {
  before(done => server.listen(3001, done));
  after(done => server.close(done));

  describe('findByName', () => {
    before(() => sequelize.truncate({ restartIdentity: true, cascade: true })
      .then(() => User.create({ name: "Tony" })));
    after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should find existing user', done => {
      chai.request(server)
        .get(`/api/users/Tony`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("name");
          expect(res.body.data.name).to.equal("Tony");
          expect(res.body.data.id).to.equal(1);
          done();
        });
    });

    it('should not find not existing user', done => {
      chai.request(server)
        .get(`/api/users/Bruce`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("err");
          expect(res.body).to.not.have.property("data");
          done();
        });
    });

  });

  describe('create', () => {
    beforeEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should create new user without errors', done => {
      let user = { name: 'Tony' };
      chai.request(server)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("name");
          expect(res.body.data.name).to.equal("Tony");
          User.all().then(users => {
            expect(users).to.have.length(1);
            done();
          });
        });
    });

    it('should not create new user if name is too short', done => {
      let user = { name: 'To' };
      chai.request(server)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          User.all().then(users => {
            expect(users).to.have.length(0);
            done();
          });
        });
    });

    it('should not create new user if name is too long', done => {
      let user = { name: 'T'.repeat(51) };
      chai.request(server)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          User.all().then(users => {
            expect(users).to.have.length(0);
            done();
          });
        });
    });

    it('should not create new user if name is already taken', done => {
      User.create({ name: "Tony" })
        .then(() => {
          let user = { name: 'Tony' };
          chai.request(server)
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .send(user)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.not.have.property("data");
              expect(res.body).to.have.property("err");
              User.all().then(users => {
                expect(users).to.have.length(1);
                done();
              });
            });
        });
    });
  });

  describe('update', () => {
    before(() => User.create({ name: "Tony" }));
    after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should update existing user', done => {
      chai.request(server)
        .put(`/api/users/1`)
        .set('Content-Type', 'application/json')
        .send({ name: 'Steve' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("name");
          expect(res.body.data.name).to.equal("Steve");
          done();
        });
    });

    it('should not update not existing user', done => {
      chai.request(server)
        .put(`/api/users/2`)
        .set('Content-Type', 'application/json')
        .send({ name: 'Bruce' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          done();
        });
    });
  });

  describe('destroy', () => {
    beforeEach(() => User.create({ name: "Tony" }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should delete existing user', done => {
      chai.request(server)
        .delete(`/api/users/1`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("name");
          expect(res.body.data.name).to.equal("Tony");
          User.all().then(users => {
            expect(users).to.have.length(0);
            done();
          });
        });
    });

    it('should not delete not existing user', done => {
      chai.request(server)
        .delete(`/api/users/2`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          User.all().then(users => {
            expect(users).to.have.length(1);
            done();
          });
        });
    });
  });
});


