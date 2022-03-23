'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Each peripheral device has:
•	a UID (number),
•	vendor (string),
•	date created,
•	status - online/offline. 
*/

var DeviceSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    date: {
        type: String,
        // required: true
    },  
    status: {
        type: String,
        // required: true
    }, 
    gateway: { 
        type: Schema.Types.ObjectId, 
        ref: 'Gateway',
        required: true
    }
});

module.exports = mongoose.model('Device', DeviceSchema);