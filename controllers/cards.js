const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла внутренняя ошибка сервера' });
      }
    });
};
