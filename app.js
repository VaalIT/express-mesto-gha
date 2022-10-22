require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const NotFound = require('./utils/NotFound');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser, signout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { error } = require('./middlewares/error');
const { regexp } = require('./utils/regexp');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.get('/signout', signout);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());
app.use(error);

app.listen(PORT);
