const mongoose = require('mongoose')
const categoryschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('Category',categoryschema)