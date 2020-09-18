const Limit = require('../dataBase/models/Limit')
const mongoose = require('mongoose')
const moment = require('moment')
mongoose.connect('mongodb://127.0.0.1:27017/drNasefTest', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


const fun = async () =>{  
for (let i = 1; i <= 365; i++)
{

    let d = (moment("1/01/2020", "MM-DD-YYYY").add(i, 'day')._d)

    let day =  new Date(d).getDay()

    
    await new Limit({ date: new Date(d).toLocaleDateString('en-US'), kashf: 20, estshara: 20, takod: 20, amlyat: 20 }).save()
}
console.log('finished')
}
fun()