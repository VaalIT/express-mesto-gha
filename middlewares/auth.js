const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/Unauthorized');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
    );
  } catch (err) {
    throw new Unauthorized('Неверный электронный адрес или пароль');
  }

  req.user = payload;

  next();
};

module.exports = auth;
