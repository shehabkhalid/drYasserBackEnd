const mongoose = require('mongoose')
const recentSchema = new mongoose.Schema({

    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        
    },
    name:{
        type:String,
        require:true
    },

})
module.exports = mongoose.model('Recent',recentSchema)