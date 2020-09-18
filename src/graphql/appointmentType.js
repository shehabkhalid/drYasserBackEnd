const graphql = require('graphql')
const {PatientType} = require('./patientType')
const Patient = require('../dataBase/models/Patient')
const {
    
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt


} = graphql;
   

const AppointmentType = new GraphQLObjectType({


    name: 'Appointment',
    fields: () => ({

        _id: { type: GraphQLID },
        note: { type: GraphQLString },
        date: { type: GraphQLString , resolve(parent){ return new Date(parent.date).toLocaleDateString('en-US')} },
        kind: { type: GraphQLString },
        insurance: { type: GraphQLString },
        owner: {
            type: PatientType,
            resolve: async (parent) =>  await Patient.findById(parent.ownerId)   
        },
        price:{type:GraphQLInt}
    })
})

const AppointmentTypeInput = new GraphQLInputObjectType({
    name: 'AppointmentInput',
    fields:{
        _id: { type: GraphQLID },
        note: { type: GraphQLString },
        date: { type: GraphQLString },
        kind: { type: GraphQLString },
        insurance: { type: GraphQLString },
        ownerId: {type: GraphQLString},
        price:{type:GraphQLInt}
    }
})

module.exports = {AppointmentType,AppointmentTypeInput}
