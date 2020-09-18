
const mongoose = require('mongoose')
const Patient = require('./models/Patient')
const jsonfile = require('jsonfile')
const Category = require('./models/Category')
const Medicine = require('./models/Medicine')
const Reservation = require('./models/Reservation')
const fs = require('fs')
mongoose.connect('mongodb://127.0.0.1:27017/drNasefTest', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const Appointment = require('../models/Appointment')

const setAppoimentsOwnerIds = async () =>
{




    try
    {

        console.log('Started')
        var allDate = await jsonfile.readFile('./Reservation.json')


        // allDate.forEach(async app =>
        // {
        let i = 0;

        for (let index = 0; index < allDate.length; index++)
        {

            const app = allDate[index]
            const p = await Patient.findOne({ oldId: app.id })


            if (p !== null)
            {



                if (app.companyName === 'Cement Companies')
                    app.companyName = 'Cement'
                else if (app.companyName === 'لايوجد')
                    app.companyName = 'none'

                await new Appointment({

                    ownerId: p._id,
                    note: app.notes,
                    kind: app.status,
                    insurance: app.companyName,
                    date: new Date(app.date).toLocaleDateString()



                }).save()
                i++

            }


        }


        console.log(i)
        console.log('Finished!')





    } catch (error)
    {
        console.log(error)

    }

}

const insertAllUser = async () =>
{
    console.log('Started')
    try
    {
        var allDate = await jsonfile.readFile('./users.json')

        
        allDate.forEach(async (p) =>
        {

            await new Patient({

                name: p.name,
                oldId: p.idusers,
                phone: p.phone1,
                gender: p.gender,
                yearOfBirth: p.date,
                address: p.address,
                knowledgeText: p.knowledge,
                location: (p.place === 'المعادي') ? 'Maadi' : 'El sayeda',
                medicalConditionText: p.medicalConditions,
                drugTakeText: p.prescripction

            }).save()

        })
        console.log('Finished!')

    } catch (error)
    {
        console.log(error)

    }
}

const insertCategories = async () =>
{
    console.log('Started')
    try
    {
        var allDate = await jsonfile.readFile('./categories.json')


        allDate.forEach(async (C) =>
        {

            await new Category({

                name: C.name,


            }).save()

        })
        console.log('Finished!')

    } catch (error)
    {
        console.log(error)

    }
}

const insertMedicine = async () =>
{
    console.log('Started')
    try
    {
        var allDate = await jsonfile.readFile('./medicine.json')


        allDate.forEach(async (M) =>
        {

            await new Medicine({

                name: M.name,
                description: M.des


            }).save()

        })
        console.log('Finished!')

    } catch (error)
    {
        console.log(error)

    }
}
const patientArrays = async () =>
{

    var allDate = await jsonfile.readFile('./ref.json')
    const methods = [
        "Net / Facebook",
        "Patient referral",
        "Doctor referral",
        "Insurance Company",
        "Friend or Relation"
    ];
    allDate.forEach(async (d) =>
    {

        const p = await Patient.findOne({ oldId: d.idUser })
        if (p != null && p.knowledgeArray.length === 0)
        {

            let ans = []
            methods.forEach(element =>
            {
                p.knowledgeArray.push({ name: element, active: false })
            });

            if (d.ref1 === 1)
                p.knowledgeArray[0].active = true
            if (d.ref2 === 1)
                p.knowledgeArray[1].active = true
            if (d.ref3 === 1)
                p.knowledgeArray[2].active = true
            if (d.ref4 === 1)
                p.knowledgeArray[3].active = true
            if (d.ref5 === 1)
                p.knowledgeArray[4].active = true

            await p.save()



        }
    })

    console.log('finish')
}
const secReservation = async () =>
{


    try
    {

        console.log('Started')
        var allDate = await jsonfile.readFile('./secReservation.json')


        // allDate.forEach(async app =>
        // {
        let i = 0;

        for (let index = 0; index < allDate.length; index++)
        {

            const app = allDate[index]
            const p = await Patient.findOne({ oldId: app.id })


            if (p !== null)
            {


                if(app.status === 'F')
                continue

                await new Reservation({

                    ownerId: p._id,
                    time: app.time,
                    confirm1: (app.confirm1 === 'YES') ? true : false,
                    confirm2: (app.confirm2 === 'YES') ? true : false,
                    kind: app.status,

                    date: new Date(app.date).toLocaleDateString()



                }).save()
                i++

            }


        }
console.log(i)
console.log('Finished')



    }
    catch (erro)
    {

    }
}


// patientArrays()
secReservation()
//setAppoimentsOwnerIds()
//insertAllUser()
// insertCategories()
//insertMedicine()