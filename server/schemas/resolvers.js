const { User, Novel, Review } = require('../models');

const { AuthenticationError } = require('apollo-server-express');

// generates a json web token
const { signToken } = require('../utils/auth');
const { faLessThanEqual } = require('@fortawesome/free-solid-svg-icons');

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
            let user = await User.findOne({ username })
                .select('-__v -password')
                .populate('novels')
                .populate('favoriteNovels')
                .populate('givenReviews')
                .populate('following')
                .populate('followers');

            user.novels.reverse();

            return user;
        },
        
        // returns all novels
        novels: async (parent, { user }) => {
            // optional user id to show one user's novels
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
            const novel = await Novel.findOne({ _id })
            .populate('user')
            // populate the reviews for the novel but also populate
            // the info within the reviews of the user who made each review.
            .populate({
                path: 'reviews',
                populate: {path: 'user'}
            })
            .exec();

            return novel;
        },

        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
              .populate('novels')
              .populate('favoriteNovels')
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
            const lowercaseUsername = args.username.toLowerCase()
            // keep console log
            console.log(lowercaseUsername);
            
            // the regexp wil find the object in the database no matter how the username
            // was capitalized. It could be NAtEy in the DB or sent in from the client and it will still 
            // match it
            const checkForUser = await User.findOne({ username: new RegExp(`^${lowercaseUsername}$`, 'i') });
            
            // if the lowercase version of the username isnt in the database either, create the user.
            if (!checkForUser) {
                // creates a user from the args object defined in typeDefs.js
                // Here, the Mongoose User model creates a new user in the database 
                // with whatever is passed in as the args.
                const user = await User.create(args);

                const token = signToken(user);
        
                // return an object that combines the token with the user's data.
                return { token, user };
            }
            throw new AuthenticationError('E11000 username');
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
                    { _id: context.user._id },
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

        addFavNovel: async (parent, { novelId }, context) => {
            if (context.user) {

                // cherck to see if novel is already in user's array
                const checkUser = await User.findOne({ _id: context.user._id });

                console.log(checkUser.favoriteNovels.includes(novelId));

                // if it is, pull it from the user array and novel array.
                if(checkUser.favoriteNovels.includes(novelId)){
                    const pullUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { favoriteNovels: novelId } },
                        { new: true }
                    );
    
                    await Novel.findByIdAndUpdate(
                        { _id: novelId },
                        { $pull: { favorites: context.user._id } },
                        { new: true }
                    );
    
                    return pullUser;
                }

                // add to user object that gave the review
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { favoriteNovels: novelId } },
                    { new: true }
                );

                // add to novel object that the review was made for
                await Novel.findByIdAndUpdate(
                    { _id: novelId },
                    { $push: { favorites: context.user._id } },
                    { new: true }
                );

                return user;
            }
            
            throw new AuthenticationError('You need to be logged in!'); 
        },

        addReview: async (parent, { reviewText, rating, novel }, context) => {
            if (context.user) {
                // create new review with the review's text and Id of novel
                // and id of user.
                const review = await Review.create({ reviewText, rating, novel, user: context.user._id });

                // add to user object that gave the review
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
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