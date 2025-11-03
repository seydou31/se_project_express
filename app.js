const { PORT = 3001 } = process.env;
const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const mainRoute = require('./routes/index');
const STATUS = require('./utils/errors');
const errorHandler = require('./middlewares/error-handler')
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors());
app.use(requestLogger);

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', mainRoute);

// log errors after routes
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// 404 handler (no next — not an error)
app.use((req, res) => {
  res.status(STATUS.NOT_FOUND).json({ message: 'Requested resource not found' });
});

// custom error handler
app.use(errorHandler);

// connect to DB, then listen
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
