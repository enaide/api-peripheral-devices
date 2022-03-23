'use strict';

var Device = require('../models/device');
var Gateway = require('../models/gateway');

var mongoosePaginate = require('mongoose-pagination');


exports.saveDevice = (req, res, next) => {
    var params = req.body;
    var device = new Device();

    if (params.gateway && params.uid && params.vendor){
        
        device.gateway = params.gateway;
        device.uid = params.uid;
        device.vendor = params.vendor;
        device.status = params.status;

        device.save((err, deviceStore) => {
        
            if(err) {
                console.log({err})
                return res.status(500).send({message: 'error at save device data'});
            }
            
            if(deviceStore){
                return res.status(200).send({device: deviceStore});
            }else{
                if(err) return res.status(500).send({message: 'fail to  save device data'});
            }
        });       

    }else{
        res.status(400).send({
            message: 'incomplete data'
        });
    }
}

exports.getDevice = (req, res, next) => {
    var deviceId = req.params.id;

    Device.findById(deviceId, (error, device) => {
        if(error) return res.status(500).send({message: 'error from request'});

        if(!device) return res.status(400).send({message: 'error on get device data'});
        
        return res.status(200).send({
            code:200,
            body: device
        });
    });
}

exports.getDevices = (req, res, next) => {
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Device.find().sort('_id').paginate(page, itemsPerPage, (error, devices, total) => {
        if(error) return res.status(500).send({message: 'error from request'});
        
        if(!devices) return res.status(400).send({message: 'error on get device data'});

        return res.status(200).send({
            devices,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

exports.postAddDevice = (req, res, next) => {
    var params = req.body;

    if (params.uid && params.vendor){
        
        const gateway = req.gateway;
        const uid = params.uid;
        const date = params.date;
        const vendor = params.vendor;
        const status = params.status;        
        const device = new Device({ uid: uid, date: date, vendor: vendor,  status: status, gateway: gateway });
       
        Device.findOne({ $or: [ {uid: device.uid.toLowerCase()}, {vendor: device.vendor.toLowerCase()} ]})
        .then(result => !result ? device.save() : result)
        .then(device => {
            const items = req.gateway.addDevicesItem(device); 
            if(!items){
                return res.status(500).json({ message: 'fail to  save device limit exceeded'});
            }            
            return res.status(200).json({ 
                code: 200,
                body: items 
            });
                                   
        })
        .catch(err => console.log(err));
    }
}