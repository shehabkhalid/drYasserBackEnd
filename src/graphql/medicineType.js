
const {

    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType,


} = require('graphql');

const MedicineTypeInput = new GraphQLInputObjectType({
    name: 'MedicineInput',
    fields: {

        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
})
const MedicineType = new GraphQLObjectType({

    name: 'Medicine',
    fields: {

        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
})

module.exports = {MedicineType,MedicineTypeInput}

