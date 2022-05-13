const { gql } = require('apollo-server-express');

// eventually change return type of addUser to auth!
// add chapters to Novel type.
const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        createdAt: String
        novels: [Novel]
        givenReviews: [Review]
        followerCount: Int
        followingCount: Int
        givenReviewCount: Int
    }

    type Review{
        _id: ID
        reviewText: String
        createdAt: String
        user: User
        novel: Novel
    }

    type Novel{
        _id: ID
        user: User
        title: String
        description: String
        createdAt: String
        penName: String
        reviews: [Review]
        reviewCount: Int
        chapterCount: Int
    }

    type Query {
        users: [User]
        user(username: String!): User
        novels(user: ID): [Novel]
    }

    type Mutation{
        addUser(username: String!, email: String!, password: String!): User
        addNovel(title: String!, description: String!, penName: String, user: ID!): Novel
    }
`

module.exports = typeDefs;