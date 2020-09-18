const cron = require("node-cron");
const Recent = require('../dataBase/models/Recent')
const Consultation = require('../dataBase/models/Consultaion')
const moment = require('moment')
const Reservation = require('../dataBase/models/Reservation')


const recentClear = () =>
{

    cron.schedule("0 0 * * Sat", async () =>
    {

        console.log('Recent Cleared')
        await Recent.deleteMany({})

    });
}


const check = (x) =>
{

    return !(x == 5)
}
const setConsultations = () =>
{
    //"00 00 * * *"
    cron.schedule("00 00 * * *", async () =>
    {

        var day = moment(new  Date().toLocaleDateString())

        if (check(day.day()))
        {
            await Consultation.deleteMany({})
            console.log("Consultations Made ")

            for (let i = 0; i < 30; i++)
            {

                day = day.add(1, 'day')
                if (check(day.day()))
                {

                    const R = await Reservation.countDocuments({ date: day._d, kind: 'استشارة' })
                   
                    if (5 - R > 0)
                    {
                        
                        await new Consultation({ day: moment(day).format('dddd'), date: day._d, left: 5 - R }).save()
                    }

                }

            }


        }
    });

}

const manualConsultations = async () =>{

    console.log("Consultations Made ")
    var day = moment(new  Date().toLocaleDateString())

    if (!check(day.day()))
    {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        await Consultation.deleteMany({})
        console.log("Consultations Made ")

        for (let i = 0; i < 30; i++)
        {


            day = day.add(1, 'day')
            if (check(day.day()))
            {

                const R = await Reservation.countDocuments({ date: day._d, kind: 'استشارة' })
               
                if (5 - R > 0)
                {
                    
                    await new Consultation({ day: moment(day).format('dddd'), date: day._d, left: 5 - R }).save()
                }

            }

        }


    }
}

module.exports = { recentClear, setConsultations , manualConsultations}