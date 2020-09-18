const mongoose = require('mongoose')
const investigationschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('Investigation',investigationschema)