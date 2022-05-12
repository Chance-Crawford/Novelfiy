const { gql } = require('apollo-server-express');

// eventually change return type of addUser to auth!
const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        createdAt: String
    }

    type Query {
        users: [User]
        user(username: String!): User
    }

    type Mutation{
        addUser(username: String!, email: String!, password: String!): User
    }
`

module.exports = typeDefs;