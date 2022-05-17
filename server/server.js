const express = require('express');
// apollo server used integrate graphQL with the express server.
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

const { authMiddleware } = require('./utils/auth');

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: authMiddleware
    });

    // start the apollo server
    await server.start();

    // connect our Apollo server to our Express.js server. This will create 
    // a special /graphql endpoint for the Express.js server that will serve as the 
    // main endpoint for accessing the entire API, with graphQL playground.
    server.applyMiddleware({ app });
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// in production serve up static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// deploy only, if there is a get request to an undefined endpoint.
// respond with production ready React front end code.

// app.get('*', (req, res) => {
//      res.sendFile(path.join(__dirname, '../client/build/index.html'));
//  });
  
  
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});