const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../constants/config');

const secret = NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV;

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    throw new UnauthorizedError(`'Необходима авторизация'`);
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    throw new UnauthorizedError(`cookies: ${cookies}`);
  }

  req.user = payload;

  next();
};
