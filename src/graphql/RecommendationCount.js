const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
   
} = graphql;

const InsuranceCountType = new GraphQLObjectType({

    name:'Recommendation',
    fields:{
        
        PatientReferral:{type:GraphQLString},
        
    }
})

module.exports =  RecommendationCount