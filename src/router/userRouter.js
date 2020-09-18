const express = require('express')
const User = require('../dataBase/models/User')
const auth = require('../middleWare/auth')

const userRouter = new express.Router()

userRouter.post('/user/login', async (req, res) =>
{

    try
    {

        const myUser = await User.login(req.body.userName, req.body.password)
        const token = await myUser.genToken()
        res.status(200).send({ role: myUser.role, token , userName:myUser.userName })



    } catch (error)
    {
        res.status(400).send({ error: error.message })

    }
})

//use in backend only
userRouter.post('/user/signup', async (req, res) =>
{

    try
    {
        const newUser = new User({

            ...req.body
        })
        await newUser.genToken()
        res.status(201).send(newUser)

    } catch (error)
    {
        res.status(400).send({ error: error.message })
    }
})


userRouter.post('/user/logout', auth, async (req, res) =>
{


    try
    {
        req.user.tokens =  req.user.tokens.filter( t=> t.token !== req.token  )
        
        await req.user.save()

        res.status(200).send()
    } catch (error)
    {
        res.status(500).send({error:error.message})
    }


})

module.exports = userRouter;