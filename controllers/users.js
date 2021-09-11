const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError, BadRequestError, ConflictError, AuthorizedError,
} = require('../errors');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError(err.message));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError(err.message));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, name } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      data: { _id: user._id, email: user.email, name: user.name },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.send({ data, token, message: 'Вы успешно авторизовались' });
    })
    .catch((err) => {
      next(new AuthorizedError(err.message));
    });
};

module.exports = {
  getUserInfo, updateUser, createUser, login,
};
