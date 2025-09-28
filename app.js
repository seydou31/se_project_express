
const { PORT = 3001 } = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mainRoute = require('./routes/index');

// body parsers must be registered before routes so handlers can access req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount routes
app.use('/', mainRoute);

// 404 — resource not found
app.use((req, res) => {
  res.status(404).json({ message: 'Requested resource not found' });
});

app.use((req, res, next) => {
  req.user = {
    _id: "68d9299567902e0a4b31f959"
  };
  next();
});

// centralized error handler (must come after routes)
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// connect to DB then start the server
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB', err);
  });
