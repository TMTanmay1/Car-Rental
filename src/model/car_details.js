const mongoose = require('mongoose')
var db = require('../db/db')

const schema = new mongoose.Schema({
    carname:{
        type:String,
        required:true
    },
    car_type:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    no_of_seats:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

const car_details = new mongoose.model('car_details',schema)
module.exports=car_details