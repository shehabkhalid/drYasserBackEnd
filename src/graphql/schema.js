const Patient = require('../dataBase/models/Patient')
const Recent = require('../dataBase/models/Recent')
const User = require('../dataBase/models/User')
const Medicine = require('../dataBase/models/Medicine')
const Xray = require('../dataBase/models/Xray')
const Category = require('../dataBase/models/Category')
const Limit = require('../dataBase/models/Limit')
const Investigation = require('../dataBase/models/investigation')
const Consultation = require('../dataBase/models/Consultaion')
const Reservation = require('../dataBase/models/Reservation')
const graphql = require('graphql')
const { PatientInput, PatientType } = require('./patientType')
const XrayType = require('./xrayType')
const CategoryType = require('./categoryType')
const UserType = require('./userType')
const InvestigationType = require('./investigationType')
const { AppointmentType, AppointmentTypeInput } = require('./appointmentType')
const { MedicineType, MedicineTypeInput } = require('./medicineType')
const { ReservationInput, ReservationType } = require('./reservationType')
const InsuranceCountType = require('./InsuranceCountType')
const { GraphQLUpload } = require('graphql-upload')
const Appointment = require('../dataBase/models/Appointment')
const Waiting = require('../dataBase/models/WatingList')
const { WaitingType } = require('../graphql/waitingType')
const moment = require('moment')
const { imageUpload, makeNormalDocs, jwtClient, createOrGetFolder, makeSpecialDocs } = require('../API/drive')
const Physiotherapy = require('../dataBase/models/Physiotherapy')
const ConsultationType = require('./consultaionType')
const { GraphQLTime } = require('graphql-iso-date')
const isAuth = ({ headers }) =>
{

    return
    if (!headers.isAuth)
        throw new Error('Authorization Failed !!')
}

const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean
} = graphql;


const RootQuery = new GraphQLObjectType({

    name: 'TheRootQuery',
    fields: {
        patient: {
            description: 'This Allows You To Search For one Patient By Id',
            type: PatientType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, args, req) =>
            {
                isAuth(req)
                return await Patient.findById(args._id)
            }
        },
        patients: {
            type: new GraphQLList(PatientType),
            resolve: async (parent, args, req) =>
            {
                isAuth(req)

                return await Patient.find({})
            }
        },
        patientAppointments: {
            type: new GraphQLList(AppointmentType),
            args: { ownerId: { type: GraphQLID } },
            resolve: async (parent, { ownerId }, req) =>
            {

                isAuth(req)
                return Appointment.find({ ownerId }).sort('-date')
            }

        },
        login: {
            description: 'login system safe',
            type: UserType,
            args: { userName: { type: GraphQLString }, password: { type: GraphQLString } },
            resolve: async (parent, { userName, password }) =>
            {


                const user = await User.login(userName, password)
                await user.genToken()
                return { ...user._doc, password: null }
            }
        },
        logout: {
            type: UserType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, { _id }, req) =>
            {
                isAuth(req)
                const user = await User.logout(_id)
                return { ...user._doc, password: null }
            }
        },
        appointment: {
            type: AppointmentType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, { _id }, req) =>
            {
                isAuth(req)
                return Appointment.findById(_id)
            }
        },
        recent: {
            type: new GraphQLList(WaitingType),

            resolve: async (p, a, req) =>
            {


                return await (await Recent.find({})).reverse();
            }



        },
        medicine: {
            type: MedicineType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {
                isAuth(req)
                return await Medicine.findById(_id)
            }

        },
        medicines: {
            type: new GraphQLList(MedicineType),
            resolve: async (p, a, req) =>
            {


                var temp = await Medicine.find({})
                return temp.sort(function (a, b) { return (a.name < b.name) ? -1 : 1 })

            }

        },
        xray: {
            type: XrayType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {

                isAuth(req)
                return await Xray.findById(_id)
            }

        },
        xrays: {

            type: new GraphQLList(XrayType),
            resolve: async (p, a, req) =>
            {

                isAuth(req)
                var temp = await Xray.find({})
                return temp.sort(function (a, b) { return (a.name < b.name) ? -1 : 1 })
            }
        },
        investigation: {
            type: InvestigationType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {

                isAuth(req)
                return await Investigation.findById(_id)
            }

        },
        investigations: {

            type: new GraphQLList(InvestigationType),
            resolve: async (p, a, req) =>
            {

                isAuth(req)
                var temp = await Investigation.find({})
                return temp.sort(function (a, b) { return (a.name < b.name) ? -1 : 1 })
            }
        },
        search: {
            type: new GraphQLList(PatientType),
            args: { name: { type: GraphQLString }, filleter: { type: GraphQLString } },
            resolve: async (p, args, req) =>
            {


                isAuth(req)
                if (args.name && !args.name.trim() || args.name === "")
                {
                    return []
                }
                let num = args.name[0];

                if(args.filleter == null)
               args.filleter = 'All'

              

                if (args.filleter == 'All')
                {

                    if (num >= '0' && num <= '9')
                        return await Patient.find({ phone: { $regex: args.name, $options: 'm' } }).limit(20)




                    return await Patient.find({ name: { $regex: args.name, $options: 'm' } }).limit(20)
                }
                else
                {
                    if (num >= '0' && num <= '9')
                        return await Patient.find({ phone: { $regex: args.name, $options: 'm' }, location: args.filleter }).limit(20)




                    return await Patient.find({ name: { $regex: args.name, $options: 'm' }, location: args.filleter }).limit(20)
                }
            }

        },
        getPatientLastReservation: {

            type: new GraphQLList(ReservationType),
            args: { ownerId: { type: GraphQLID } },
            resolve: async (p, { ownerId }, req) =>
            {

                isAuth(req)


                return await Reservation.find({ ownerId, kind: { $ne: 'R' } }).sort({ date: -1 }).limit(1)

            }
        },
        getDayReservations: {
            type: new GraphQLList(ReservationType),
            args: { date: { type: GraphQLString }, filter: { type: GraphQLString } },
            resolve: async (p, { date, filter }, req) =>
            {

                isAuth(req)

                date = new Date(date).toLocaleDateString()
                if (filter === 'allD')
                    return await Reservation.find({ date, kind: { $ne: 'R' } })
                else if (filter === 'all')
                    return await Reservation.find({ date, kind: { $ne: 'R' }, confirm2: false })
                else if (filter === 'confirmed')
                    return await Reservation.find({ date, confirm1: true, kind: { $ne: 'R' } })
                return await Reservation.find({ date, confirm1: false, kind: { $ne: 'R' } })
            }

        },
        category: {
            type: CategoryType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {

                isAuth(req)
                return await Category.findById(_id)
            }

        },
        categories: {

            type: new GraphQLList(CategoryType),
            resolve: async (p, a, req) =>
            {

                isAuth(req)
                var temp = await Category.find({})
                return temp.sort(function (a, b) { return (a.name < b.name) ? -1 : 1 })
            }
        },
        InsuranceCount: {
            type: InsuranceCountType,
            resolve: async (parent, args, req) =>
            {

                return await Appointment.getCount()
            }
        },
        getWaitingList: {
            type: new GraphQLList(WaitingType),

            resolve: async (p, a, req) =>
            {


                return await Waiting.find({});
            }


        },
        getPatientFolderID: {
            type: GraphQLString,
            args: { _id: { type: GraphQLString } },
            resolve: async (p, _id, req) =>
            {

                try
                {
                    return await createOrGetFolder(_id, jwtClient)
                } catch (error)
                {

                }

            }
        },
        physiotherapy: {

            type: new GraphQLList(XrayType),
            resolve: async (p, a, req) =>
            {

                isAuth(req)
                var temp = await Physiotherapy.find({})
                return temp.sort(function (a, b) { return (a.name < b.name) ? -1 : 1 })
            }
        },
        Consultations: {
            type: new GraphQLList(ConsultationType),
            resolve: async (p, a, req) =>
            {

                return await Consultation.find({ left: { $gt: 0 } })
            }
        },
        getMoney: {
            type: new GraphQLList(GraphQLInt),
            resolve: async (p, a, req) =>
            {

                function getWeekNumber(d)
                {
                    // Copy date so don't modify original
                    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                    // Set to nearest Thursday: current date + 4 - current day number
                    // Make Sunday's day number 7
                    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
                    // Get first day of year
                    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    // Calculate full weeks to nearest Thursday
                    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
                    // Return array of year and week number
                    return [d.getUTCFullYear(), weekNo];
                }

                var ans = [0,0,0]



                var date = new Date().toLocaleDateString()
                var sum = 0

                const x = await Appointment.find({ date })
                for (let index = 0; index < x.length; index++)
                {
                    sum += x[index].price

                }
                const y = await Appointment.aggregate([

                    { $addFields: { "week": { $week: '$date' } } },
                    { $match: { week: getWeekNumber(new Date())[1] - 1 } },
                    { $group: { _id: null, amount: { $sum: "$price" } } }
                ])

                const z = await Appointment.aggregate([

                    { $addFields: { "month": { $month: '$date' } } },
                    { $match: { month: new Date().getMonth() + 1 } },
                    { $group: { _id: null, amount: { $sum: "$price" } } }
                ])


                ans[0]=sum
                ans[1]=y[0]
                ans[2]=z[0]

                return ans
            }



        },
        insurance: {
            type: new GraphQLList(AppointmentType),
            args: { from: { type: GraphQLString }, to: { type: GraphQLString }, company: { type: GraphQLString } },
            resolve: async (p, { from, to, company }, req) =>
            {

                if (company == 'All')
                    return await Appointment.find({ date: { $gte: from, $lte: to },kind:"تعاقد" })
                else
                    return await Appointment.find({ date: { $gte: from, $lte: to }, insurance: company,kind:"تعاقد" })

            }
        },
        finance: {
            type: new GraphQLList(AppointmentType),
            args: { from: { type: GraphQLString }, to: { type: GraphQLString }, kind: { type: GraphQLString } },
            resolve: async (p, { from, to, kind }, req) =>
            {

                if (kind == 'All')
                    return await Appointment.find({ date: { $gte: from, $lte: to } , $or:[{kind:'كشف'},{kind:'Operation'}]})
                else
                    return await Appointment.find({ date: { $gte: from, $lte: to }, kind:kind })

            }
        }




    },

})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPatient: {

            type: PatientType,
            args: { patientInput: { type: PatientInput } },
            resolve: async (parent, { patientInput }, req) =>
            {
                isAuth(req)


                patientInput = { ...patientInput, yearOfBirth: new Date().getFullYear() - patientInput.yearOfBirth }
                const newPatient = new Patient(patientInput)
                await newPatient.save()
                return newPatient._doc


            }
        },
        removePatient: {

            type: PatientType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, { _id }, req) =>
            {
                isAuth(req)

                await Reservation.deleteMany({ ownerId: _id })
                await Recent.findOneAndDelete({ ownerId: _id })
                await Appointment.deleteMany({ ownerId: _id })
                await Waiting.deleteMany({ ownerId: _id })
                return await Patient.findByIdAndDelete({ _id })

            }

        },
        updatePatient: {
            type: PatientType,
            args: { patientInput: { type: PatientInput } },
            resolve: async (parent, { patientInput }, req) =>
            {
                isAuth(req)

                patientInput = { ...patientInput, yearOfBirth: new Date().getFullYear() - patientInput.yearOfBirth }

                const oldPatient = await Patient.findById(patientInput._id)
                if (!oldPatient)
                    throw new Error('Patient Not Found')
                const fields = Object.keys(patientInput)

                fields.forEach(element =>
                {
                    oldPatient[element] = patientInput[element]
                });

                await oldPatient.save()
                return oldPatient
            }
        },
        addUser: {
            type: UserType,
            args: {
                userName: { type: GraphQLString },
                password: { type: GraphQLString },
                role: { type: GraphQLString },
                token: { type: GraphQLString }
            },
            resolve: async (parent, args, req) =>
            {
                isAuth(req)
                const newUser = await new User(args);
                await newUser.genToken()
                return newUser
            }

        },
        addAppointment: {
            type: AppointmentType,
            args: { appointmentInput: { type: AppointmentTypeInput } },
            resolve: async (parent, { appointmentInput }, req) =>
            {

                isAuth(req)
                appointmentInput.date = new Date(appointmentInput.date).toLocaleDateString()
                const newApp = new Appointment(appointmentInput)
                await newApp.save()
                return newApp
            }


        },
        updateAppointment: {
            type: AppointmentType,
            args: { appointmentInput: { type: AppointmentTypeInput } },
            resolve: async (parent, { appointmentInput }, req) =>
            {


                isAuth(req)
                const oldAppointment = await Appointment.findById(appointmentInput._id)
                const fields = Object.keys(appointmentInput)
                if (!fields.includes('price'))
                    fields.push('price')
                if (!oldAppointment)
                    throw new Error('Appointment Not Found')

                fields.forEach(element =>
                {
                    if (element === 'date')
                        oldAppointment[element] = new Date(oldAppointment[element]).toLocaleDateString()
                    oldAppointment[element] = appointmentInput[element]
                });
                await oldAppointment.save()

                return oldAppointment


            }

        },
        removeAppointment: {
            type: AppointmentType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, { _id }, req) =>
            {
                isAuth(req)
                return await Appointment.findByIdAndDelete({ _id })
            }
        },

        addMedicine: {
            type: MedicineType,
            args: { medicineInput: { type: MedicineTypeInput } },
            resolve: async (parent, { medicineInput }, req) =>
            {
                isAuth(req)
                return await new Medicine(medicineInput).save()
            }

        },
        updateMedicine: {
            type: MedicineType,
            args: { medicineInput: { type: MedicineTypeInput } },
            resolve: async (parent, { medicineInput }, req) =>
            {
                isAuth(req)
                const oldMedicine = await Medicine.findById(medicineInput._id)
                const fields = Object.keys(medicineInput)
                if (!oldMedicine)
                    throw new Error('Medicine Not Found')

                fields.forEach(element =>
                {
                    oldMedicine[element] = medicineInput[element]
                });
                await oldMedicine.save()
                return oldMedicine
            }
        },
        removeMedicine: {

            type: MedicineType,
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, { _id }, req) =>
            {

                isAuth(req)
                return await Medicine.findByIdAndDelete({ _id })
            }
        },
        addXray: {
            type: XrayType,
            args: { name: { type: GraphQLString } },
            resolve: async (p, args, req) =>
            {

                isAuth(req)
                return await new Xray(args).save()
            }

        },
        updateXray: {
            type: XrayType,
            args: { _id: { type: GraphQLID }, name: { type: GraphQLString } },
            resolve: async (p, { _id, name }, req) =>
            {

                isAuth(req)
                const xray = await Xray.findById(_id)
                if (!xray)
                    throw new Error('Not Found!')
                xray.name = name
                return await xray.save()
            }

        },
        removeXray: {
            type: XrayType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {
                isAuth(req)
                return await Xray.findByIdAndDelete(_id)
            }
        },
        addInvestigation: {
            type: InvestigationType,
            args: { name: { type: GraphQLString } },
            resolve: async (p, args, req) =>
            {

                isAuth(req)
                return await new Investigation(args).save()
            }

        },
        updateInvestigation: {
            type: InvestigationType,
            args: { _id: { type: GraphQLID }, name: { type: GraphQLString } },
            resolve: async (p, { _id, name }, req) =>
            {

                isAuth(req)
                const investigation = await Investigation.findById(_id)
                if (!investigation)
                    throw new Error('Not Found!')
                investigation.name = name
                return await investigation.save()
            }

        },
        removeInvestigation: {
            type: InvestigationType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {
                isAuth(req)
                return await Investigation.findByIdAndDelete(_id)
            }
        },
        addReservation: {
            type: ReservationType,
            args: { reservationInput: { type: ReservationInput } },
            resolve: async (p, { reservationInput }, req) =>
            {
                isAuth(req)



                const map = { استشارة: 'estshara', تعاقد: 'takod', 'متابعة عمليات': 'amlyat', كشف: 'kashf' }

                let { date, kind, ownerId } = reservationInput



                date = new Date(date).toLocaleDateString()

                const reservations = await Reservation.find({ date })


                if (reservations.length === 0)
                {

                    var momentTime = moment.utc("03:00 PM", "hh:mm A");

                    for (let i = 1; i <= 50; i++)
                    {

                        let time = momentTime.format("hh:mm A")
                        const reservation = await new Reservation({ time, kind: 'R', date }).save()

                        reservations.push(reservation)
                        if (i % 5 === 0)
                            momentTime.add(1, 'hours')

                    }
                }



                for (let r of reservations)
                {
                    if (r.kind === 'R')
                    {
                        r.ownerId = ownerId
                        r.kind = kind
                        return await r.save()

                    }

                }

                throw new Error('Something Wrong Happened ')

            }

        },
        updateReservation: {
            type: ReservationType,
            args: { reservationInput: { type: ReservationInput } },
            resolve: async (p, { reservationInput }, req) =>
            {


                isAuth(req)


                const oldReservation = await Reservation.findById(reservationInput._id)
                if (!oldReservation)
                    throw new Error('Reservation Not Found')
                const fields = Object.keys(reservationInput)

                fields.forEach(element =>
                {
                    oldReservation[element] = reservationInput[element]
                });

                await oldReservation.save()
                return oldReservation
            }
        },
        addCategory: {
            type: CategoryType,
            args: { name: { type: GraphQLString } },
            resolve: async (p, args, req) =>
            {

                isAuth(req)
                return await new Category(args).save()
            }

        },
        updateCategory: {
            type: CategoryType,
            args: { _id: { type: GraphQLID }, name: { type: GraphQLString } },
            resolve: async (p, { _id, name }, req) =>
            {

                isAuth(req)
                const category = await Category.findById(_id)
                if (!category)
                    throw new Error('Not Found!')
                category.name = name
                return await category.save()
            }

        },
        removeCategory: {
            type: CategoryType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {
                isAuth(req)
                return await Category.findByIdAndDelete(_id)
            }
        },
        addPhysiotherapy: {
            type: XrayType,
            args: { name: { type: GraphQLString } },
            resolve: async (p, args, req) =>
            {

                isAuth(req)
                return await new Physiotherapy(args).save()
            }

        },
        updatePhysiotherapy: {
            type: XrayType,
            args: { _id: { type: GraphQLID }, name: { type: GraphQLString } },
            resolve: async (p, { _id, name }, req) =>
            {

                isAuth(req)
                const xray = await Physiotherapy.findById(_id)
                if (!xray)
                    throw new Error('Not Found!')
                xray.name = name
                return await xray.save()
            }

        },
        removePhysiotherapy: {
            type: XrayType,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, { _id }, req) =>
            {
                isAuth(req)
                return await Physiotherapy.findByIdAndDelete(_id)
            }
        },
        sendToWaiting: {

            type: GraphQLBoolean,
            args: { res: { type: ReservationInput } },
            resolve: async (p, { res }, req) =>
            {

                const R = await Reservation.findById(res._id)
                if (R !== null)
                    await R.updateOne({ confirm2: true })
                await new Waiting(res).save()



                return true;

            }

        },
        removeFromWaiting: {
            type: GraphQLBoolean,
            args: { _id: { type: GraphQLID } },
            resolve: async (p, _id, req) =>
            {


                try
                {

                    await Waiting.deleteOne({ _id: _id })
                    return true
                } catch (error)
                {
                    throw error('fiha haga weskha')
                }
            }
        },
        sendToRecent: {

            type: GraphQLBoolean,
            args: { res: { type: ReservationInput } },
            resolve: async (p, { res }, req) =>
            {



                await new Recent(res).save()



                return true;

            }
        },
        makeRoshta: {
            type: GraphQLString,
            args: { info: { type: GraphQLList(GraphQLString) } },
            resolve: async (p, args, req) =>
            {


                return await makeNormalDocs(args.info, jwtClient)
            }
        },
        makeSpecialDocs: {
            type: GraphQLString,
            args: { info: { type: GraphQLList(GraphQLString) } },
            resolve: async (p, args, req) =>
            {


                return await makeSpecialDocs(args.info, jwtClient)
            }

        },
        editCon: {
            type: GraphQLBoolean,
            args: { _id: { type: GraphQLID }, operation: { type: GraphQLBoolean } },
            resolve: async (p, args, req) =>
            {

                let num = (args.operation) ? -1 : 1;

                let C = await Consultation.findById({ _id: args._id })

                C.left += num;
                await C.save()

                return true

            }
        }



    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
