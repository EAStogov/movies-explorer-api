const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../midlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30)
  })
}), createUser)

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login)

// signout

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;