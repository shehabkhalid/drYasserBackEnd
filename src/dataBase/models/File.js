const mongoose = require('mongoose')
const fileSchema = new mongoose.Schema({

    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    fileId:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model('File',fileSchema)