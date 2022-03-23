'use strict';

var mongoose = require('mongoose');
// var GateWay = require('./models/gateway');

var app = require('./app');
var port = process.env.PORT || 3000;
var uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qutvs.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => {
    console.log('success connextion to musala-soft');

    app.listen(port, () => {
        console.log('startUp server on port 3800');
    })
})
.catch(error => {
    console.log(error);
})