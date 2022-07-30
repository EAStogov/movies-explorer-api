const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const secret = NODE_ENV === 'production' ? JWT_SECRET : 'secret_key';

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
