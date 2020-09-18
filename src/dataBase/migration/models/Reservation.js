const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },
    kind: {
        type: String,
        required: true

    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default : mongoose.Types.ObjectId("5e97b4ef207a92c6b1cd8fc0")
        
    },
    confirm1:{
        type:Boolean,
        default:false
    },
    confirm2:{
        type:Boolean,
        default:false
    },
    time:{
        type:String,
        required:true

    }
})

module.exports = mongoose.model('Reservation', reservationSchema)