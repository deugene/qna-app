'use strict';

const models = require('../models');
const Question = models.Question;
const Answer = models.Answer;
const User = models.User;

module.exports = {
  all(req, res, next) {

    // define find options
    let opts = {
      offset: req.body.offset,
      limit: req.body.limit,
      include: [ { model: User, as: 'author' } ]
    };
    const userId = req.body.userId;
    if (userId) {
      Object.assign(opts, { where: { userId: userId } });
    }
    const status = req.body.status;

    // update find optinos, find and send questions if unanswered questions are
    // needed
    if (status && status === 'unanswered') {
      opts.include.push({
        model: Answer,
        as: 'answers',
        required: false,
        attributes: [ 'id' ]
      });
      Question.findAll(opts)
        .then(questions => {
          const notAnsweredQuestions = questions.filter(q => {
            return q.answers.length === 0;
          });
          console.log(notAnsweredQuestions);
          res.json({
            count: notAnsweredQuestions.length,
            data: notAnsweredQuestions.slice(
              opts.offset,
              opts.offset + opts.limit + 1
            )
          });
        });
    } else {

      // update find options if answered questions are needed
      if (status && status === 'answered') {
        opts.include.push({
          model: Answer,
          where: { questionId: { $ne: null } },
          attributes: [ 'id' ],
          as: 'answers'
        });
      }

      Question.findAndCount(opts)
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
        {
          model: Answer,
          as: 'answers'
        }
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
