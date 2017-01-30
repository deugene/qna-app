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

// require Answer model
const models = require('../models');
const Answer = models.Answer;
const Question = models.Question;
const User = models.User;
const sequelize = models.sequelize;

describe('Answers', () => {
  before(done => server.listen(3001, done));
  after(done => server.close(done));

  describe('findAllByQuestionId', () => {
    before(() => {
      return sequelize.truncate({ restartIdentity: true, cascade: true })
        .then(() => {
          return User.create({ name: 'Tony' })
            .then(() => {
              return Promise.all([
                Question.create({ body: "question0", title: "question0", userId: 1 }),
                Question.create({ body: "question1", title: "question1", userId: 1 }),
              ]);
            })
            .then(() => {
              return Answer.create({ body: "lorem0", questionId: 1, userId: 1 })
                .then(() => Answer.create({ body: "lorem1", questionId: 1, userId: 1 }))
                .then(() => Answer.create({ body: "lorem2", questionId: 2, userId: 1 }))
                .then(() => Answer.create({ body: "lorem3", questionId: 1, userId: 1 }));
            });
        });
    });
    after(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should find all existing answers for current question', done => {
      const searchOpts = {
        offset: 0,
        limit: 10
      };
      chai.request(server)
        .post('/api/questions/1/answers')
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

    it('should paginate result', done => {
      let searchOpts = { offset: 0, limit: 2 };
      chai.request(server)
        .post('/api/questions/1/answers')
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
            .post('/api/questions/1/answers')
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
              expect(res.body.data[0].body).to.equal("lorem3");
              done();
            });
        });
    });

  });

  describe('create', () => {
    beforeEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should create answer without errors', done => {
      let answer = { body: 'lorem' };
      chai.request(server)
        .post('/api/answers')
        .set('Content-Type', 'application/json')
        .send(answer)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("lorem");
          Answer.all().then(answers => {
            expect(answers).to.have.length(1);
            done();
          });
        });
    });

    it('should not create answer which body is too short', done => {
      let answer = { body: 'bo' };
      chai.request(server)
        .post('/api/answers')
        .set('Content-Type', 'application/json')
        .send(answer)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Answer.all().then(answers => {
            expect(answers).to.have.length(0);
            done();
          });
        });
    });

    it('should not create answer which body is too long', done => {
      let answer = { body: 'b'.repeat(5001) };
      chai.request(server)
        .post('/api/answers')
        .set('Content-Type', 'application/json')
        .send(answer)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Answer.all().then(answers => {
            expect(answers).to.have.length(0);
            done();
          });
        });
    });
  });

  describe('update', () => {
    beforeEach(() => Answer.create({ body: "lorem" }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should update existing answer', done => {
      chai.request(server)
        .put(`/api/answers/1`)
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

    it('should not update not existing answer', done => {
      chai.request(server)
        .put(`/api/answers/2`)
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
    beforeEach(() => Answer.create({ body: "lorem" }));
    afterEach(() => sequelize.truncate({ restartIdentity: true, cascade: true }));

    it('should delete existing answer', done => {
      chai.request(server)
        .delete(`/api/answers/1`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("err");
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.have.property("body");
          expect(res.body.data.body).to.equal("lorem");
          Answer.all().then(answers => {
            expect(answers).to.have.length(0);
            done();
          });
        });
    });

    it('should not delete not existing answer', done => {
      chai.request(server)
        .delete(`/api/answers/2`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.not.have.property("data");
          expect(res.body).to.have.property("err");
          Answer.all().then(answers => {
            expect(answers).to.have.length(1);
            done();
          });
        });
    });
  });
});


