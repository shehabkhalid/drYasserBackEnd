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

const UserType = new GraphQLObjectType({

    name:'User',
    fields:()=>({

        _id:{type:GraphQLID},
        userName:{type:GraphQLString},
        password:{type:GraphQLString},
        role:{type:GraphQLString},
        token:{type:GraphQLString}

    })
})
module.exports = UserType