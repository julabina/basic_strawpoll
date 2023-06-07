const express = require('express');
const morgan = require('morgan');
const userRoute = require('./routes/user');
const pollRoute = require('./routes/poll');
const { removeTempExp } = require('./cron/cron-temp');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(morgan('dev'));

removeTempExp();

app.use('/api/user', userRoute);
app.use('/api/poll', pollRoute);

module.exports = app;