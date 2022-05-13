const { User, Novel, Review } = require('../models');

const resolvers = {
    Query: {
        users: async () => {
            return User.find()
              .select('-__v -password')
              .populate('novels')
              .populate('givenReviews');
          },
      
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('novels')
                .populate('givenReviews');
        },
        
        novels: async (parent, { user }) => {
            const params = user ? { user } : {};

            // finds all novels that have this user ID as their
            // "user" property.
            const novels = Novel.find(params)
            .populate('user')

            // put in descending order (newest)
            return novels.sort({ createdAt: -1 });
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
        },

        // add context later 
        addNovel: async (parent, args, context) => {
            const novel = await Novel.create({...args});

            await User.findByIdAndUpdate(
                { _id: args.user },
                { $push: { novels: novel._id } },
                // Remember, without the { new: true } flag 
                // in User.findByIdAndUpdate(), Mongo would return the original 
                // document instead of the updated document.
                { new: true }
            );

            return novel;
        }
    }
}

module.exports = resolvers;