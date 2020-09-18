const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
   
} = graphql;

const CategoryType = new GraphQLObjectType({

    name:'Category',
    fields:{
        
        _id:{type:GraphQLID},
        name:{type:GraphQLString}
    }
})

module.exports =  CategoryType