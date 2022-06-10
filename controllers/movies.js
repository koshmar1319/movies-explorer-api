const Movie = require('../models/movie');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((data) => {
      if (req.user._id === data.owner._id.toString()) {
        return Movie.findByIdAndRemove(req.params.id)
          .then((movie) => res.send({ message: 'Фильм удален', movie }));
      }
      return next(new ForbiddenError('У вас нет доступа для осуществления данных действий'));
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Запрашиваемый фильм не найден'));
      }
      return next(err);
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
