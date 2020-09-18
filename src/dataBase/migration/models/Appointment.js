const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({

    note: {
        type: String,
        default: ''

    },
    date: {
        type: Date,
        required: true,
    },
    kind: {
        type: String,
        required: true,
        // validate(value)
        // {
        //     const kinds = ['استشارة', 'كشف', 'متابعة عمليات','تعاقد]
        //     if (!kinds.find(value))
        //         throw Error('Wrong type of Appointment')
        // }
    },
    insurance: {
        type: String,
        default: 'none'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price:{
        type:Number,
        default:0 
     }
 

})
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;