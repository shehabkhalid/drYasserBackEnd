const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType

} = graphql;
const PatientArrayType = new GraphQLObjectType({
    name: 'PatientArray',
    fields: {
        name: { type: GraphQLString },
        active: { type: GraphQLBoolean }
    }

})
const PatientArrayTypeInput = new GraphQLInputObjectType({
    name: 'PatientArrayInput',
    fields: {
        name: { type: GraphQLString },
        active: { type: GraphQLBoolean }
    }

})
const PatientInput = new GraphQLInputObjectType(
    {
        name: 'PatientInput',
        fields: () => ({

            _id:{type: GraphQLID},
            name: { type: GraphQLString },
            yearOfBirth: { type: GraphQLInt },
            gender: { type: GraphQLString },
            address: { type: GraphQLString },
            phone: { type: GraphQLString },
            medicalConditionText: { type: GraphQLString },
            drugTakeText: { type: GraphQLString },
            medicalConditionArray: { type: new GraphQLList(PatientArrayTypeInput) },
            knowledgeArray: { type: new GraphQLList(PatientArrayTypeInput) },
            drugTakeArray: { type: new GraphQLList(PatientArrayTypeInput) },
            knowledgeText: { type: GraphQLString },
            location: { type: GraphQLString },
            insurance: { type: GraphQLString },
            catagories: {type:new GraphQLList(GraphQLString)}

        })
    }
)
const PatientType = new GraphQLObjectType(
    {
        name: 'Patient',
        fields: () => ({

            _id: { type: GraphQLID },
            name: { type: GraphQLString },
            yearOfBirth: { type: GraphQLInt, resolve({ yearOfBirth }) { return (new Date().getFullYear()) - yearOfBirth } },
            gender: { type: GraphQLString },
            address: { type: GraphQLString },
            phone: { type: GraphQLString },
            medicalConditionText: { type: GraphQLString },
            drugTakeText: { type: GraphQLString },
            medicalConditionArray: { type: new GraphQLList(PatientArrayType) },
            knowledgeArray: { type: new GraphQLList(PatientArrayType) },
            drugTakeArray: { type: new GraphQLList(PatientArrayType) },
            knowledgeText: { type: GraphQLString },
            location: { type: GraphQLString },
            insurance: { type: GraphQLString },
            catagories: {type:new GraphQLList(GraphQLString)}


        })
    })

module.exports = {PatientType,PatientInput}