/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/BadRequestError');
const Conflict = require('../errors/Conflict');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UnknownError = require('../errors/UnknownError');

const User = require('../models/user');

const { JWT_SECRET } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((me) => {
      if (!me) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: me });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user && user.email !== req.user.email) {
        return next(new Conflict('Пользователь с таким email уже существует'));
      }
      User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return next(new NotFoundError('Пользователь не найден'));
          }
          return res.send({ data: updatedUser });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Введены некорректные данные'));
          } else if (err.name === 'CastError') {
            next(new BadRequestError('Некорректный id'));
          } else {
            next(new UnknownError('Что-то пошло не так'));
          }
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Введены некорректные данные'));
          }
        });
      return res.send({
        email: req.body.email,
        name: req.body.name,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
      });

      return res.send({ token });
    })
    .catch(next);
};

const logout = (_req, res) => res.clearCookie('jwt').send({ message: 'JWT-Cookie успешно удален' });

module.exports = {
  getMe,
  updateUserProfile,
  createUser,
  login,
  logout,
};
