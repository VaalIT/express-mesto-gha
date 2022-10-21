const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  if (!token) {
    next(new UNAUTHORIZED('Неверный электронный адрес или пароль'));
    return;
  }

  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UNAUTHORIZED('Неверный электронный адрес или пароль'));
    return;
  }

  req.user = payload;

  next();
};
