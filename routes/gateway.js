'use strict';

var express = require('express');
var GatewayController = require('../controllers/gateway');

var api = express.Router();
var mdPeriph = require('../middlewares/peripheral');

// api.get('/hello', mdPeriph.ensurePeriph, GatewayController.hello);
api.get('/gateway/:id', GatewayController.getGateWay);
api.get('/gateways', GatewayController.getIndex);
api.post('/register-gateway', mdPeriph.ensurePeriph, GatewayController.postAddGateWay);
api.post('/remove-device', mdPeriph.ensurePeriph, GatewayController.postRemoveDevice);
api.post('/remove-gateway', mdPeriph.ensurePeriph, GatewayController.postRemoveGateway);

module.exports = api;