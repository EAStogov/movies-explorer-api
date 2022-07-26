/* eslint-disable consistent-return */
const BadRequestError = require('../errors/BadRequestError');
const Conflict = require('../errors/Conflict');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');

const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        return next(new NotFoundError('Фильмы не найдены'));
      }
      return res.send({ data: movies });
    })
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.findOne({ movieId: req.body.movieId, owner: req.user._id })
    .then((movie) => {
      if (movie) {
        return next(new Conflict('Фильм уже добавлен в библиотеку'));
      }
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner,
      })
        .then((newMovie) => res.send({ data: newMovie }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            // next(new BadRequestError('Введены некорректные данные'));
            res.send(err);
            next(err);
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const movieId = req.params._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }
      if (JSON.stringify(req.user._id) !== JSON.stringify(movie.owner)) {
        return next(new Forbidden('Невозможно удалить чужой фильм'));
      }
      Movie.findByIdAndRemove(movieId)
        .then((removedMovie) => res.send({ data: removedMovie }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, postMovie, deleteMovie };
