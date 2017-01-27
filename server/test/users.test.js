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
const User = require('../models').User;

describe('Users', () => {
  before(done => server.listen(3001, done));
  after(done => server.close(done));

  describe('create', () => {
    beforeEach(() => User.sync({ force: true }));
    after(() => User.sync({ force: true }));

    it('should create user without errors', done => {
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

    it('should not create user which name is too short', done => {
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

    it('should not create user which name is too long', done => {
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
  });

  describe('findById', () => {
    let userId;
    before(() => User.create({ name: "Tony" }).then(user => userId = user.id));
    after(() => User.sync({ force: true }));

    it('should find existing user', done => {
      chai.request(server)
        .get(`/api/users/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("name");
          expect(res.body.data.name).to.equal("Tony");
          done();
        });
    });

    it('should not find not existing user', done => {
      chai.request(server)
        .get(`/api/users/${userId + 1}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("err");
          expect(res.body).to.not.have.property("data");
          done();
        });
    });

  });

  describe('update', () => {
    let userId;
    beforeEach(() => User.create({ name: "Tony" }).then(user => userId = user.id));
    afterEach(() => User.sync({ force: true }));

    it('should update existing user', done => {
      chai.request(server)
        .put(`/api/users/${userId}`)
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
        .put(`/api/users/${userId + 1}`)
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
    let userId;
    beforeEach(() => User.create({ name: "Tony" }).then(user => userId = user.id));
    afterEach(() => User.sync({ force: true }));

    it('should delete existing user', done => {
      chai.request(server)
        .delete(`/api/users/${userId}`)
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
        .delete(`/api/users/${userId + 1}`)
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


