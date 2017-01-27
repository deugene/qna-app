'use strict';

const models = require('../models');
const User = models.User;

module.exports = {
  create(req, res, next) {
    User.findOne({ where: { name: req.body.name } })
      .then(user => {
        if (user) { throw new Error('User Already Exists'); }
        const newUser = req.body;
        return User.create(newUser, { fields: Object.keys(newUser) });
      })
      .then(newUser => res.json({ data: newUser }))
      .catch(next);
  },
  findByName(req, res, next) {
    User.findOne({ where: { name: req.params.userName } })
      .then(user => {
        if (!user) { throw new Error('User Not Found'); }
        res.json({ data: user });
      })
      .catch(next);
  },
  update(req, res, next) {
    User.findById(req.params.userId)
      .then(user => {
        if (!user) { throw new Error('User Not Found'); }
        return user.update(req.body, { fields: Object.keys(req.body) });
      })
      .then(updatedUser => res.json({ data: updatedUser }))
      .catch(next);
  },
  destroy(req, res, next) {
    let deletedUser;
    User.findById(req.params.userId)
      .then(user => {
        if (!user) { throw new Error('User Not Found'); }
        deletedUser = user;
        return user.destroy();
      })
      .then(() => res.json({ data: deletedUser }))
      .catch(next);
  }

};
