var GateWay = require('../models/gateway');

exports.ensurePeriph = (req, res, next) => {
    var periphId = req.body.periphId;    
    
    if(periphId){
        
        GateWay.findById(periphId)
        .then(gateway => {
            // console.log({p: periphId, gateway});
            req.gateway = gateway;
            next();
        })
        .catch(err => console.log(err));
    }else{
        req.gateway = null;
        next();
    }
}