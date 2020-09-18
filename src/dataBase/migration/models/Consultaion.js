const mongoose = require('mongoose')

const consultationSchema =  new mongoose.Schema({

    day:{
        type:String,
        required:true,
    },
    date: {
        type:Date,
        required:true
    },
    left:{
        type:Number,
        default:5
    }
})

module.exports =  mongoose.model('Consultation', consultationSchema)