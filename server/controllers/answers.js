'use strict';

const models = require('../models');
const Answer = models.Answer;
const User = models.User;

module.exports = {
  findAllByQuestionId(req, res, next) {
    Answer.findAndCountAll({
      offset: req.body.offset,
      limit: req.body.limit,
      where: { questionId: req.params.questionId },
      include: [ { model: User, as: 'author' } ]
    })
      .then(result => {
        res.json({
          count: result.count,
          data: result.rows
        });
      })
      .catch(next);
  },
  create(req, res, next) {
    Answer.create(req.body, { fields: Object.keys(req.body) })
      .then(answer => res.json({ data: answer }))
      .catch(next);
  },
  update(req, res, next) {
    Answer.findById(req.params.answerId)
      .then(answer => {
        if (!answer) { throw new Error('Answer Not Found'); }
        return answer.update(req.body, { fields: Object.keys(req.body) });
      })
      .then(updatedAnswer => res.json({ data: updatedAnswer }))
      .catch(next);
  },
  destroy(req, res, next) {
    let deletedAnswer;
    Answer.findById(req.params.answerId)
      .then(answer => {
        if (!answer) { throw new Error('Answer Not Found'); }
        deletedAnswer = answer;
        return answer.destroy();
      })
      .then(() => res.json({ data: deletedAnswer }))
      .catch(next);
  }
};
