const jwt = require('jsonwebtoken')
const User = require('../dataBase/models/User')


const auth = async (req, res, next) =>
{

  
    if(req.headers.authorization)
    {
        
        const token = req.headers.authorization.replace('Bearer ', '')
        
        const decode = jwt.verify(token, 'drnasef')
        const user = await User.findOne({ _id: decode._id, 'token': token })

        if (!user)
        {
           return next()
        }
        req.headers={

            ...res.headers,
            isAuth:true 
        }
    }

    next()

}

module.exports = auth;