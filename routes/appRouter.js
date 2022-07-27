const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

//login && register

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;