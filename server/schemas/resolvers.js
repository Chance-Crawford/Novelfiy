const { User, Novel, Review } = require('../models');

const { AuthenticationError } = require('apollo-server-express');

// generates a json web token
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // return all users
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
                .populate('givenReviews')
                .populate('following')
                .populate('followers');
        },
        
        // returns all novels
        // optional user id to show one user's novels
        novels: async (parent, { user }) => {
            const params = user ? { user } : {};

            // finds all novels that have this user ID as their
            // "user" property.
            const novels = Novel.find(params)
            .populate('user')
            .populate('reviews');

            // put in descending order (newest)
            return novels.sort({ createdAt: -1 });
        },

        // novel id
        novel: async (parent, { _id }) => {
            // returns single novel from the novel id given
            return Novel.findOne({ _id })
            .populate('user')
            .populate('reviews');
        },

        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('novels')
                .populate('givenReviews')
                .populate('following')
                .populate('followers');
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in!');
      
        }
    },

    Mutation: {

        addUser: async (parent, args) => {
            // creates a user from the args object defined in typeDefs.js
            // Here, the Mongoose User model creates a new user in the database 
            // with whatever is passed in as the args.
            const user = await User.create(args);

            const token = signToken(user);
    
            // return an object that combines the token with the user's data.
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            // uses bcrypt to compare the incoming password with the hashed password
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };
          },

        // add context later 
        addNovel: async (parent, args, context) => {
            if (context.user) {
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
            
            throw new AuthenticationError('You need to be logged in!');
        },

        // add context later
        addReview: async (parent, { reviewText, novel, user }, context) => {
            if (context.user) {
                // create new review with the review's text and Id of novel
                // and id of user.
                const review = await Review.create({ reviewText, novel, user });

                // add to user object that gave the review
                await User.findByIdAndUpdate(
                    { _id: user },
                    { $push: { givenReviews: review._id } },
                    { new: true }
                );

                // add to novel object that the review was made for
                await Novel.findByIdAndUpdate(
                    { _id: novel },
                    { $push: { reviews: review._id } },
                    { new: true }
                );

                return review;
            }
            
            throw new AuthenticationError('You need to be logged in!'); 
        }
    }
}

module.exports = resolvers;