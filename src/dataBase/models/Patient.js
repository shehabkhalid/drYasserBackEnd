const mongoose = require('mongoose')


const patientSchema = new mongoose.Schema({


    oldId:{
        type:Number,
        default:-1
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true
    }
    ,
    yearOfBirth: {
        type: Number,
        required: true
    },
    phone:{
        type:String,
        required:true
    },
    gender: {
        type: String,
        validate(value)
        {
            
            if (value !== 'Male' && value !== 'Female')
                throw Error('gender must be "Male" or "Female" ')
        },
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    medicalConditionText: {
        type: String,
        default: "",

    },
    drugTakeText: {
        type: String,
        default: "",
    },
    knowledgeText: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        required: true
    }
    ,
    insurance: {
        type: String,
        default: 'none'

    },
    medicalConditionArray: [{

        name: {
            type: String,

        },
        active: {
            type: Boolean,
            default: false
        }
        

    }],
    knowledgeArray: [{

        name: {
            type: String,

        },
        active: {
            type: Boolean,
            default: false
        }

    }]
    ,
    drugTakeArray: [{

        name: {
            type: String,

        },
        active: {
            type: Boolean,
            default: false
        }

    }],
    catagories:[]


})
// patientSchema.statics.getPatients = async ()=>{


    
//     const patients =  await Patient.find({}).select('name , _id')
//     return patients;


// }
const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;