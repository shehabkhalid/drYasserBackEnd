const {

    GraphQLObjectType,
    GraphQLString,
    GraphQLID,



} = require('graphql');



const InvestigationType = new GraphQLObjectType({

    name:'Investigation',
    fields:{
        
        _id:{type:GraphQLID},
        name:{type:GraphQLString}
    }
})

module.exports =  InvestigationType