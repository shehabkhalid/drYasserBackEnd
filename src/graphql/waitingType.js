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
const WaitingType = new GraphQLObjectType({

    name:'WaitingType',
    fields: () =>({
        _id:{type:GraphQLID},
        name:{type:GraphQLString},
        kind: { type: GraphQLString },
        time: { type: GraphQLString },
        ownerId: {type: GraphQLString}
    })
})

module.exports  = {WaitingType}
