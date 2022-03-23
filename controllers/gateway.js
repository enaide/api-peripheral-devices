'use strict';

var GateWay = require('../models/gateway');
var Device = require('../models/device');

var mongoosePaginate = require('mongoose-pagination');

exports.hello = (req, res, next) => {
    return res.status(200).send({ peripherical: req.gateWay});
}

/* 
exports.saveGateway = (req, res, next) => {
    var params = req.body;
    var gateWay = new GateWay();

    if (params.serial && params.name){
        gateWay.serial = params.serial;
        gateWay.name = params.name;

        GateWay.find({ $or: [
            {serial: gateWay.serial.toLowerCase()},
            {name: gateWay.name.toLowerCase()}
        ]}).exec((error, gateWays) => {
            
            if(error) return res.status(500).send({message: 'error at search gateway data'});
            
            if(gateWays && gateWays.length>=1){
                return res.status(500).send({message: 'error duplicate gateway'});
            }else{
                gateWay.save((err, gatewayStore) => {
            
                    if(err) return res.status(500).send({message: 'error at save gateway data'});
                    
                    if(gatewayStore){
                        return res.status(200).send({gateWay: gatewayStore});
                    }else{
                        if(err) return res.status(500).send({message: 'fail to  save gateway data'});
                    }
                });
            }
        }) ;        

    }else{
        res.status(400).send({
            message: 'incomplete data'
        });
    }
}
 */

exports.getGateWay = (req, res, next) => {
    var gateWayId = req.params.id;

    GateWay.findById(gateWayId, (error, gateWay) => {
        if(error) return res.status(500).send({
            code: 500,
            message: 'error from request'
        });

        if(!gateWay) return res.status(400).send({
            code: 400,
            message: 'error on get gateway data'
        });
        
        return res.status(200).json({ 
            code: 200,
            body: gateWay 
        });
    });
}

exports.getGateWays = (req, res, next) => {
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    GateWay.find().sort('_id').paginate(page, itemsPerPage, (error, gateWays, total) => {
        if(error) return res.status(500).send({message: 'error from request'});
        
        if(!gateWays) return res.status(400).send({message: 'error on get gateway data'});

        return res.status(200).send({
            gateWays,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

exports.postAddGateWay = (req, res, next) => {
    var params = req.body;

    if (params.serial && params.name){
        const serial = params.serial;
        const name = params.name;
        const ipv4_addressd = params.ipv4_addressd;

        const gateWay = new GateWay(
            {
                serial: serial,
                name: name,
                ipv4_addressd
            }
        );
        gateWay.save().then(gateway => {
            return res.status(200).send({
                code: 200,
                body: gateway
            });
        })
        .catch(err => {
            return res.status(500).send({
                code: 500,
                error: err
            });
        });
    }
}

exports.postRemoveDevice = (req, res, next) => {
    const deviceId = req.body.deviceId;
    req.gateway.removeDevicesItem(deviceId).then()
    
    Device.findByIdAndRemove(deviceId)
    .then(result =>{
        return res.status(200).send({
            code: 200,
            body: {
                remove: result
            }
        });
    })
    .catch(err => console.log(err));

}

exports.getIndex = (req, res, next) => {
    GateWay.find().populate('devices.items.deviceId').sort('_id').then(gateways =>{
        return res.status(200).send({
            code:200,
            body: gateways
        });
    });
}

exports.postRemoveGateway = (req, res, next) => {
    const deviceId = req.gateway._id;
    GateWay.findByIdAndRemove(deviceId)
    .then(result =>{
        return res.status(200).send({
            code: 200,
            remove: result
        });
    })
    .catch(err => console.log(err));
}