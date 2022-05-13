const { User } = require('../models');

const resolvers = {
    Query: {
        users: async () => {
            return User.find()
              .select('-__v -password')
          },
      
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
        },
    },

    Mutation: {

        // change to return a token too when implementing auth.
        addUser: async (parent, args) => {
            // creates a user from the args object defined in typeDefs.js
            // Here, the Mongoose User model creates a new user in the database 
            // with whatever is passed in as the args.
            const user = await User.create(args);

            return user;
        }

    }
}

module.exports = resolvers;