const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
