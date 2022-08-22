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
const { DB_DEV } = require('./constants/config');
const urls = require('./constants/url');

const {
  NODE_ENV,
  DB,
  PORT = 3000,
} = process.env;

const app = express();

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors({
  origin: urls,
  withCredentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use('', appRouter);

const db = NODE_ENV === 'production' ? DB : DB_DEV;
mongoose.connect(db);

app.use(errorLogger);

app.use(errors());

app.use((err, _req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
