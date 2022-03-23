'use strict';

var express = require('express');
const app = express();

var cors = require('cors');
app.use(cors());

// load routes
var gateway_routes = require('./routes/gateway');
var device_routes = require('./routes/device');

// middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// cors

// routes
app.use('/api', gateway_routes);
app.use('/api', device_routes);

// exports
module.exports = app;
