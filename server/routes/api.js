const router = require('express').Router();
const controllers = require('../controllers');

// users
router.get('/users/:userName', controllers.users.findByName);
router.post('/users', controllers.users.create);
router.put('/users/:userId', controllers.users.update);
router.delete('/users/:userId', controllers.users.destroy);

// questions
router.post('/questions/all', controllers.questions.all);
router.get('/questions/:questionId', controllers.questions.findById);
router.post('/questions', controllers.questions.create);
router.put('/questions/:questionId', controllers.questions.update);
router.delete('/questions/:questionId', controllers.questions.destroy);

// answers
router.post('/questions/:questionId/answers', controllers.answers.findAllByQuestionId);
router.post('/answers', controllers.answers.create);
router.put('/answers/:answerId', controllers.answers.update);
router.delete('/answers/:answerId', controllers.answers.destroy);

module.exports = router;
