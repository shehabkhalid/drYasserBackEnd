const mongoose = require('mongoose')
const physiotherapyschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('Physiotherapy',physiotherapyschema)