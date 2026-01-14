const express = require('express');
const { connect } = require('./broker/broker');
const setupListeners = require('./broker/listners');

const app = express();

connect();

app.get('/', (req, res) => {
    res.send('Notification Service is up and running!');
});

setupListeners();

module.exports = app;

