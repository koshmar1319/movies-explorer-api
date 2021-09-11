const express = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoute = require('./users');
const moviesRoute = require('./movies');
const { validateRegister, validateLogin } = require('../middlewares/validation');
const { NotFoundError } = require('../errors');

const routes = express.Router();

routes.post('/signup', validateRegister, createUser);
routes.post('/signin', validateLogin, login);

routes.use(auth);
routes.use('/users', usersRoute);
routes.use('/movies', moviesRoute);
routes.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = routes;
