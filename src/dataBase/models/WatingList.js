const mongoose = require('mongoose')

const waitingSchema = new mongoose.Schema({

   name:{
       type:String,
       require:true
   },
   kind:{
       type:String,
       require:true,

   },
   time:{
       type:String,
       default:'NO TIME'
   },
   ownerId:{
       type: mongoose.Schema.Types.ObjectId,
       unique:true
   }
})

module.exports = mongoose.model('Waiting', waitingSchema)