const Patient = require('../dataBase/models/Patient')
const express = require('express')
const auth = require('../middleWare/auth')

const patientRouter = new express.Router()

patientRouter.post('/patient/add', auth, async (req, res) =>
{
    try
    {
        let date = new Date().getFullYear();
        req.body.yearOfBirth = date - req.body.yearOfBirth

        const newPatient = new Patient({
            ...req.body
        })

        await newPatient.save()
        res.status(200).send(newPatient)
    } catch (error)
    {

        res.status(400).send({ error: error.message })
    }

})
patientRouter.patch('/patient/update/:id', auth, async (req, res) =>
{
    try
    {
        const fields = Object.keys(req.body)
        const myPatient = await Patient.findById(req.params.id)
        let date = new Date().getFullYear();
        req.body.yearOfBirth = date - req.body.yearOfBirth


        fields.forEach(f => myPatient[f] = req.body[f])

        await myPatient.save()

        res.status(200).send(myPatient)



    } catch (error)
    {
        res.status(400).send({ error: error.message })

    }

})
patientRouter.get('/patient/:id', auth, async (req, res) =>
{

    try
    {
        const patient = await Patient.findById(req.params.id);

        if (!patient)
            throw Error('not found')

        res.status(200).send(patient)

    } catch (error)
    {
        res.status(400).send({ error: error.message })

    }

})
patientRouter.get('/patients', auth, async (req, res) =>
{

    try
    {
        const patients = await Patient.getPatients()


        if (!patients)
            throw Error('not found')

        res.send(patients)


    } catch (error)
    {

        res.status(400).send({ error: error.message })
    }
})

module.exports = patientRouter;