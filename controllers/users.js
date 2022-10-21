const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
    })
    .catch(() => res.status(UNAUTHORIZED).send({ message: 'Отказано в доступе' }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id пользователя' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.getMyInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id пользователя' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};
