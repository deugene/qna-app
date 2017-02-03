'use strict';

const models = require('../models');
const Question = models.Question;
const Answer = models.Answer;
const User = models.User;

module.exports = {
  all(req, res, next) {

    // define search options
    let opts = {
      offset: req.body.offset,
      limit: req.body.limit,
      order: [[ 'id', 'DESC' ]],
      include: [
        { model: Answer, as: 'answers', attributes: [ 'id' ] },
        { model: User, as: 'author' }
      ]
    };
    const userId = req.body.userId;
    if (userId) {
      Object.assign(opts, { where: { userId: userId } });
    }
    const status = req.body.status;

    // update search options if answered questions are needed
    if (status && status === 'answered') {
      opts.include[0].where = { questionId: { $ne: null } };
    }

    // find and send unanswered questions if they are needed
    if (status && status === 'unanswered') {
      Question.findAll(opts)
        .then(questions => {
          const notAnsweredQuestions = questions.filter(q => {
            return q.answers.length === 0;
          });
          res.json({
            count: notAnsweredQuestions.length,
            data: notAnsweredQuestions.slice(
              opts.offset,
              opts.offset + opts.limit + 1
            )
          });
        });

    // else find and send questions that match opts
    } else {
      Question.findAndCountAll(opts)
        .then(result => {

          // send questions
          res.json({
            count: result.count,
            data: result.rows
          });
        })
        .catch(next);
    }

  },
  findById(req, res, next) {
    Question.findById(req.params.questionId, {
      include: [
        { model: Answer, as: 'answers' },
        { model: User, as: 'author' }
      ]
    })
      .then(question => {
        if (!question) { throw new Error('Question Not Found'); }
        res.json({ data: question });
      })
      .catch(next);
  },
  create(req, res, next) {
    Question
      .create(req.body, { fields: Object.keys(req.body) })
      .then(question => res.json({ data: question }))
      .catch(next);
  },
  update(req, res, next) {
    Question.findById(req.params.questionId)
      .then(question => {
        if (!question) { throw new Error('Question Not Found'); }
        return question.update(req.body, { fields: Object.keys(req.body) });
      })
      .then(updatedQuestion => res.json({ data: updatedQuestion }))
      .catch(next);
  },
  destroy(req, res, next) {
    let deletedQuestion;
    Question
      .findById(req.params.questionId)
      .then(question => {
        if (!question) { throw new Error('Question Not Found'); }
        deletedQuestion = question;
        return question.destroy();
      })
      .then(() => res.json({ data: deletedQuestion }))
      .catch(next);
  }
};
