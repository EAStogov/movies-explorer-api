const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

router.get('/movies', );

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    owner: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required()
  })
}), );

router.delete('movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24)
  })
}))

module.exports = router;