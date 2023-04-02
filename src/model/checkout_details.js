const mongoose = require('mongoose')
var db = require('../db/db')

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    carname:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    }
})

const checkout_details = new mongoose.model('checkout_details',schema)
module.exports=checkout_details