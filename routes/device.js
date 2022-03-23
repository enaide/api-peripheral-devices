'use strict';

var express = require('express');
var DeviceController = require('../controllers/device');

var api = express.Router();
var mdPeriph = require('../middlewares/peripheral');

api.get('/device/:id', DeviceController.getDevice);
api.get('/devices/:page', DeviceController.getDevices);
// api.post('/register-device', DeviceController.saveDevice);
api.post('/register-device', mdPeriph.ensurePeriph, DeviceController.postAddDevice);

module.exports = api;