const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, getMyInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.get('/users/me', getMyInfo);
usersRouter.patch('/users/me', updateUserInfo);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
