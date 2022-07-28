const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnknownError = require('../errors/UnknownError');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then(movies => {
      if (!movies) {
        return next(new NotFoundError('Фильмы не найдены'))
      }
      return res.send({ data: movies })
    })
    .catch(next)
}

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
    nameEN } = req.body;
  const owner = req.user._id;

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
    owner})
    .then((newMovie => {
      return res.send({ data: newMovie })
    }))
    .catch(next);
}

const deleteMovie = (req, res, next) => {
  const movieId = req.params._id
  Movie.findById(movieId)
    .then(movie => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'))
      }
      Movie.findOneAndRemove(movie)
        .then(removedMovie => res.send({ data: removedMovie }))
        .catch(err => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Введены некорректные данные'))
          } else {
            next(new UnknownError('Что-то пошло не так'))
          }
        })
    })
    .catch(next)
}

module.exports = { getMovies, postMovie, deleteMovie }