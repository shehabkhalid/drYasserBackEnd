const graphql = require('graphql')
const Patient = require('../dataBase/models/Patient')
const {PatientType} = require('./patientType')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType

} = graphql;

const ReservationType = new GraphQLObjectType({

    name: 'Reservation',
    fields: () => ({
        _id: { type: GraphQLID },
        date: { type: GraphQLString, resolve(parent) { return new Date(parent.date).toLocaleDateString('en-US') } },

        kind: { type: GraphQLString },
        owner: {
            type: PatientType,
            resolve: async (parent) => await Patient.findById(parent.ownerId)
        },
        confirm1: { type: GraphQLBoolean },
        confirm2: { type: GraphQLBoolean },
        time: { type: GraphQLString }
    })
})


const ReservationInput = new GraphQLInputObjectType({

    name:'ReservationInput',
    fields: () =>({
        _id: { type: GraphQLID },
        name:{type:GraphQLString},
        confirm1: { type: GraphQLBoolean },
        confirm2: { type: GraphQLBoolean },
        date: { type: GraphQLString },
        kind: { type: GraphQLString },
        time: { type: GraphQLString },
        ownerId: {type: GraphQLString}
    })
})

module.exports = {ReservationType,ReservationInput}