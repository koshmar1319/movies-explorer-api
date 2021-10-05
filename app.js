const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const limiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const { PORT, MONGO_URL, NODE_ENV } = require('./config');

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'Access-Control-Allow-Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3001);
