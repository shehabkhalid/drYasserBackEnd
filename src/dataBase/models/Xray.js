const mongoose = require('mongoose')
const xrayschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('Xray',xrayschema)