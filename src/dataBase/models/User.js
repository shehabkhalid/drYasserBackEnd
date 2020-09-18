const mongoose = require('mongoose')
const jwt =  require('jsonwebtoken')
const bcrypt =  require('bcrypt')
const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    token:{
        type:String
    }

})
userSchema.methods.genToken = async function ()
{
    const user = this
    
    const token = jwt.sign({ _id: user._id.toString() }, 'drnasef')
    user.token = token
    await user.save()

    return token
}



userSchema.pre('save', async function (next)
{


    if (this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password, 8)
        console.log('UserSaved')
    }

    next()
})
userSchema.statics.login = async (userName, password) =>
{

    
    const user = await User.findOne({ userName })

    if (!user)
        throw new Error('Invalid UserName')


    if (!await bcrypt.compare(password, user.password))

        throw Error('Invalid Password')




    return user
}

userSchema.statics.logout = async (_id) =>
{

    
    const user = await User.findById(_id)

    if (!user)
        throw new Error('Invalid User')


    user.token = ""

    await user.save()

    return user
}
const User = mongoose.model('User', userSchema);
module.exports = User;