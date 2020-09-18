const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
   
} = graphql;

const InsuranceCountType = new GraphQLObjectType({

    name:'InsuranceType',
    fields:{
        
        AXA:{type:GraphQLString},
        Cement:{type:GraphQLString},
        CBE:{type:GraphQLString},

    }
})

module.exports =  InsuranceCountType