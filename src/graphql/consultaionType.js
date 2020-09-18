const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt
   
} = graphql;

const ConsultationType = new GraphQLObjectType({

    name:'Consultation',
    fields:{
        
        _id:{type:GraphQLID},
        day:{type:GraphQLString},
        date: { type: GraphQLString, resolve(parent) { return new Date(parent.date).toLocaleDateString('en-US') } },
        left: {type:GraphQLInt}
    }
})

module.exports =  ConsultationType