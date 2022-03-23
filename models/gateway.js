'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Each gateway has:
•	a unique serial number (string), 
•	human-readable name (string),
•	IPv4 address (to be validated),
•	multiple associated peripheral devices.  
*/

var GateWaySchema = Schema({
    serial: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    ipv4_addressd: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
                const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
                return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
                // return regex.test(str);
            },
            message: props => `${props.value} is not a valid IP address`
          },        
    },    
    devices : {
        items:[
            {
                deviceId: { type: Schema.Types.ObjectId, ref:'Device' ,required: true},
                // quantity: { type: Number, required:true }
            }
        ]
    }
});

GateWaySchema.methods.addDevicesItem = function(device){        
        
    /*     
    const deviceIndex = this.devices.items.findIndex(d => {
        return d.deviceId.toString() === device._id.toString();
    });

    let newQuantity = 1;
    const updateDevicesItems = [...this.devices.items];

    if(deviceIndex>=0){
        
        if(this.devices.items[deviceIndex].quantity<5){
            newQuantity = this.devices.items[deviceIndex].quantity + 1;
            updateDevicesItems[deviceIndex].quantity = newQuantity;
        }
        else{  return null;  }
        
    }else{ updateDevicesItems.push({ deviceId: device._id, quantity: newQuantity }); } 
    */

    const updateDevicesItems = [...this.devices.items];
    if(this.devices.items.length<10){
        updateDevicesItems.push({ deviceId: device._id });
    }else{
        return null;
    }
    const updateDevice = { items: updateDevicesItems };
    
    this.devices = updateDevice;
    this.save();
    return this.devices;
}

GateWaySchema.methods.removeDevicesItem = function(deviceId){

    const updateDevicesItems = this.devices.items.filter(item =>{
        return item.deviceId.toString() !== deviceId.toString();
    });
    this.devices.items = updateDevicesItems;

    return this.save();
}

module.exports = mongoose.model('Gateway', GateWaySchema);

