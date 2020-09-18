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

const LimitType = new GraphQLObjectType({
    name: 'LimitType',
    fields: () => ({

        _id: { type: GraphQLID },
        date: { type: GraphQLString, resolve(parent) { return new Date(parent.date).toLocaleDateString('en-US') } },
        kashf: { type: GraphQLInt },
        estshara: { type: GraphQLInt },
        takod: { type: GraphQLInt },
        amlyat: { type: GraphQLInt },


    })
})

const LimitInput = new GraphQLInputObjectType({


    name: 'LimitInput',
    fields: {
        _id: { type: GraphQLID },
        date: { type: GraphQLString },
        kashf: { type: GraphQLInt },
        estshara: { type: GraphQLInt },
        takod: { type: GraphQLInt },
        amlyat: { type: GraphQLInt },
    }

})

module.exports = { LimitInput, LimitType }