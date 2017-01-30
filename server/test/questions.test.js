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

// require Question model
const models = require('../models');
const Question = models.Question;
const User = models.User;
const Answer = models.Answer;
const sequelize = models.sequelize;

describe('Questions', () => {
  before(done => server.listen(3001, done));
  after(done => server.close(done));

  describe('all', () => {
    before(() => {
      return sequelize.truncate({ restartIdentity: true, cascade: true })
        .then(() => {
          return Promise.all([
            User.create({ name: 'Tony' }),
            User.create({ name: 'Bruce' })
          ])
            .then(() => {
              return Question.create({ body: "lorem0", title: "lorem0", userId: 1 })
                .then(() => Question.create({ body: "lorem1", title: "lorem1", userId: 2 }))
                .then(() => Question.create({ body: "lorem2", title: "lorem2", userId: 1 }));
            });
        });
    });
    after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should find all existing question', done => {
      const searchOpts = {
        offset: 0,
        limit: 10
      };
      chai.request(server)
        .post('/api/questions/all')
        .set('Content-Type', 'application/json')
        .send(searchOpts)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("length");
          expect(res.body.data).to.have.length(3);
          expect(res.body.data[0]).to.have.property("body");
          expect(res.body.data[0].body).to.equal("lorem0");
          expect(res.body.count).to.equal(3);
          done();
        });
    });

    it('should find all existing question by user id', done => {
      const searchOpts = {
        offset: 0,
        limit: 10,
        userId: 1
      };
      chai.request(server)
        .post('/api/questions/all')
        .set('Content-Type', 'application/json')
        .send(searchOpts)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("length");
          expect(res.body.data).to.have.length(2);
          expect(res.body.data[0]).to.have.property("body");
          expect(res.body.data[1].body).to.equal("lorem2");
          expect(res.body.count).to.equal(2);
          done();
        });
    });

    it('should paginate result', done => {
      let searchOpts = { offset: 0, limit: 2 };
      chai.request(server)
        .post('/api/questions/all')
        .set('Content-Type', 'application/json')
        .send(searchOpts)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("length");
          expect(res.body.data).to.have.length(2);
          expect(res.body.data[0]).to.have.property("body");
          expect(res.body.data[0].body).to.equal("lorem0");
          expect(res.body.count).to.equal(3);
          searchOpts = { offset: 2, limit: 2 };
          chai.request(server)
            .post('/api/questions/all')
            .set('Content-Type', 'application/json')
            .send(searchOpts)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.not.have.property("err");
              expect(res.body).to.have.property("data");
              expect(res.body.data).to.have.property("length");
              expect(res.body.data).to.have.length(1);
              expect(res.body.data[0]).to.have.property("body");
              expect(res.body.data[0].body).to.equal("lorem2");
              expect(res.body.count).to.equal(3);
              done();
            });
        });
    });

    describe('answered questions', () => {
      before(() => Answer.create({ body: 'lorem', questionId: 1, userId: 1}));
      after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

      it('should find answered questions', done => {
        const searchOpts = {
          offset: 0,
          limit: 10,
          status: 'answered'
        };
        chai.request(server)
          .post('/api/questions/all')
          .set('Content-Type', 'application/json')
          .send(searchOpts)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.not.have.property("err");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("length");
            expect(res.body.data).to.have.length(1);
            expect(res.body.data[0]).to.have.property("body");
            expect(res.body.data[0].body).to.equal("lorem0");
            expect(res.body.count).to.equal(1);
            done();
          });
      });

      it('should find unanswered questions', done => {
        const searchOpts = {
          offset: 0,
          limit: 10,
          status: 'unanswered'
        };
        chai.request(server)
          .post('/api/questions/all')
          .set('Content-Type', 'application/json')
          .send(searchOpts)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.not.have.property("err");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("length");
            expect(res.body.data).to.have.length(2);
            expect(res.body.data[0]).to.have.property("body");
            expect(res.body.data[0].body).to.equal("lorem1");
            expect(res.body.count).to.equal(2);
            done();
          });
      });
    });

  });

  describe('findById', () => {
    before(() => Question.create({ body: "lorem", title: "lorem" }));
    after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should find existing question', done => {
      chai.request(server)
        .get(`/api/questions/1`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("lorem");
          done();
        });
    });

    it('should not find not existing question', done => {
      chai.request(server)
        .get(`/api/questions/2`)
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

    it('should create question without errors', done => {
      let question = { body: 'lorem', title: 'lorem' };
      chai.request(server)
        .post('/api/questions')
        .set('Content-Type', 'application/json')
        .send(question)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("lorem");
          Question.all().then(questions => {
            expect(questions).to.have.length(1);
            done();
          });
        });
    });

    it('should not create question which body is too short', done => {
      let question = { body: 'bo', title: 'lorem' };
      chai.request(server)
        .post('/api/questions')
        .set('Content-Type', 'application/json')
        .send(question)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Question.all().then(questions => {
            expect(questions).to.have.length(0);
            done();
          });
        });
    });

    it('should not create question which body is too long', done => {
      let question = { body: 'b'.repeat(5001), title: 'lorem' };
      chai.request(server)
        .post('/api/questions')
        .set('Content-Type', 'application/json')
        .send(question)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Question.all().then(questions => {
            expect(questions).to.have.length(0);
            done();
          });
        });
    });
  });

  describe('update', () => {
    beforeEach(() => Question.create({ body: 'lorem', title: 'lorem' }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should update existing question', done => {
      chai.request(server)
        .put(`/api/questions/1`)
        .set('Content-Type', 'application/json')
        .send({ body: 'update' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("update");
          done();
        });
    });

    it('should not update not existing question', done => {
      chai.request(server)
        .put(`/api/questions/2`)
        .set('Content-Type', 'application/json')
        .send({ body: 'another update' })
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
    beforeEach(() => Question.create({ body: 'lorem', title: 'lorem' }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should delete existing question', done => {
      chai.request(server)
        .delete(`/api/questions/1`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("lorem");
          Question.all().then(questions => {
            expect(questions).to.have.length(0);
            done();
          });
        });
    });

    it('should not delete not existing question', done => {
      chai.request(server)
        .delete(`/api/questions/2`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Question.all().then(questions => {
            expect(questions).to.have.length(1);
            done();
          });
        });
    });
  });

});


