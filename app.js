const express = require('express');
const usersRouter = require('./routes/users');
const { PORT = 3000 } = process.env;

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', usersRouter);

app.listen(PORT);