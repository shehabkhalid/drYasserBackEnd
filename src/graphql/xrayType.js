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

const XrayType = new GraphQLObjectType({

    name:'Xray',
    fields:{
        
        _id:{type:GraphQLID},
        name:{type:GraphQLString}
    }
})

module.exports =  XrayType