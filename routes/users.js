const usersRouter = require('express').Router();
const { getAllUsers, getUserById, createUser } = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.post('/users', createUser);

module.exports = usersRouter;