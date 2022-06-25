const { gql } = require('apollo-server-express');

// eventually change return type of addUser to auth!
// add chapters to Novel type.
const typeDefs = gql`
    scalar Upload

    type User{
        _id: ID
        username: String
        email: String
        createdAt: String
        imageLink: String
        novels: [Novel]
        favoriteNovels: [Novel]
        givenReviews: [Review]
        following: [User]
        followers: [User]
        followerCount: Int
        followingCount: Int
        givenReviewCount: Int
    }

    type Chapter{
        _id: ID
        chapterTitle: String
        chapterText: String
        createdAt: String
        novelId: Novel
        comments: [Comment]
    }

    type File {
        filename: String
        mimetype: String
        encoding: String
    }

    type Review{
        _id: ID
        reviewText: String
        rating: Int
        createdAt: String
        user: User
        novel: Novel
    }

    type Comment{
        _id: ID
        commentText: String
        createdAt: String
        user: User
        chapter: Chapter
    }

    type Novel{
        _id: ID
        user: User
        title: String
        description: String
        createdAt: String
        penName: String
        imageLink: String
        chapters: [Chapter]
        favorites: [User]
        reviews: [Review]
        reviewCount: Int
        chapterCount: Int
        favoritesCount: Int
    }

    type Query {
        users: [User]
        user(username: String!): User
        novels(user: ID): [Novel]
        novel(_id: ID!): Novel
        chapter(_id: ID!): Chapter
        me: User
    }

    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addNovel(title: String!, description: String!, penName: String): Novel
        addChapter(chapterTitle: String!, chapterText: String!, novelId: ID!): Chapter
        addFavNovel(novelId: ID!): User
        addToFollowing(userId: ID!): User
        singleUpload(file: Upload!): File!
        addReview(reviewText: String!, rating: Int!, novel: ID!): Review
        addComment(commentText: String!, chapter: ID!): Comment
        removeNovel(novelId: ID!): User
        updateNovel(novelId: ID!, title: String!, description: String!, penName: String, imageLink: String): Novel
        removeChapter(chapterId: ID!, novelId: ID!): Novel
        updateChapter(chapterId: ID!, chapterTitle: String!, chapterText: String!): Chapter
    }

    type Auth {
        token: ID!
        user: User
    }
`

module.exports = typeDefs;