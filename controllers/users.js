const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnknownError = require('../errors/UnknownError');
const User = require('../models/user');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then(me => {
      if (!me) {
        return next(new NotFoundError('Пользователь не найден'))
      }
      return res.send({ data: me });
    })
    .catch(next);
}

const updateUserProfile = (req, res, next) => {
  const {name, email} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: updatedUser });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    })
}

module.exports = { getMe, updateUserProfile };