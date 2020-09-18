const mongoose = require('mongoose')

const limitSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },
    kashf:{
        type:Number,
        required:true,
    },
    estshara:{
        type:Number,
        required:true,
    },
    takod:{         
        type:Number,
        required:true,
    },
    amlyat:{
        type:Number,
        required:true,
    },
})

module.exports = mongoose.model('Limit', limitSchema)