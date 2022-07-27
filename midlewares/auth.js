const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {JWT_SECRET} = process.env;

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    throw new UnauthorizedError('Необходима авторизация')
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация')
  }

  req.user = payload;

  next();
}