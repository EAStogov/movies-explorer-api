require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const appRouter = require('./routes/appRouter');
const { requestLogger, errorLogger } = require('./midlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors({
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use(requestLogger);

app.use('', appRouter);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
});