const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    Name:{
        type: String,
        required : true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    confirm_password:{
        type:String,
        required:true
    }
})

const infos = new mongoose.model('infos',schema)
module.exports = infos;