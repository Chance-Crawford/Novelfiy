const { User, Novel, Review, Chapter } = require('../models');
const { GraphQLUpload } = require('apollo-upload-server');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();
const {createWriteStream} = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require('path');
const { finished } = require("stream/promises");
let pathName;

// generates a json web token
const { signToken } = require('../utils/auth');

const randomID = (length) =>  {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
   }
   return result;
}

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
                .populate({
                    path: 'novels',
                    populate: {path: 'favorites'}
                })
                .populate({
                    path: 'favoriteNovels',
                    populate: {path: 'user'}
                })
                .populate({
                    path: 'givenReviews',
                    populate: {path: 'novel'}
                })
                .populate('following')
                .populate('followers')
                .exec();

            user.novels.reverse();
            // make sure a review that the user has given hasnt been deleted
            user.givenReviews = user.givenReviews.filter((review)=> review.novel?._id).reverse();
            user.favoriteNovels.reverse();
            user.following.reverse();
            user.followers.reverse();

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
            .populate('reviews')
            .populate('chapters');

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
            .populate('chapters')
            .exec();

            return novel;
        },

        chapter: async (parent, { _id }) => {
            // returns single novel from the novel id given
            const chapter = await Chapter.findOne({ _id })
            .populate({
                path: 'novelId',
                populate: {path: 'chapters'}
            })
            .populate({
                path: 'novelId',
                populate: {path: 'user'}
            });

            return chapter;
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

    Upload: GraphQLUpload,

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

        addNovel: async (parent, args, context) => {
            if (context.user) {
                // upload image from server to cloudinary
                await cloudinary.uploader
                .upload(pathName, {
                    resource_type: "image",
                })
                .then(async (res) => {
                    console.log("Success!", JSON.stringify(res, null, 2));
                    
                    args.imageLink = res.secure_url;
                    console.log(args.imageLink);
                })
                .catch((error) => {
                    console.log("Error!", JSON.stringify(error, null, 2));
                });

                // create novel
                const novel = await Novel.create({...args, user: context.user._id });

                console.log(novel);

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

        addChapter: async (parent, args, context) => {
            if (context.user) {
                // create new review with the review's text and Id of novel
                // and id of user.
                const chapter = await Chapter.create({...args});

                // add to novel object that the review was made for
                await Novel.findByIdAndUpdate(
                    { _id: args.novelId },
                    { $push: { chapters: chapter._id } },
                    { new: true }
                );

                return chapter;
            }
            
            throw new AuthenticationError('You need to be logged in!'); 
        },

        // for single upload to work, make sure you check your github answers to
        // see how you got it to work. you have to add some things to 
        // package.json
        singleUpload: async (parent, { file }, context) => {
            if (context.user) {
                const { createReadStream, filename, mimetype, encoding } = await file;
                const stream = createReadStream();

                if(encoding){
                    // get file type at the end of filename
                    let filenameArr = filename.split('.');
                    const ext = filenameArr[filenameArr.length - 1]
                    
                    // store file
                    // random name doesnt use filename because if filename has numbers
                    // or spaces sometimes it will corrupt the file
                    const randomName = `${randomID(15)}.${ext}`
                    // ***make sure this path is within the server directory
                    pathName = path.join(__dirname, `../images/${randomName}`);

                    const out = createWriteStream(pathName);
                    stream.pipe(out);
                    await finished(out);


                    return { filename, mimetype, encoding};
                }else{
                    pathName = '';
                }
                
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        addFavNovel: async (parent, { novelId }, context) => {
            if (context.user) {

                // check to see if novel is already in user's array
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

        addToFollowing: async (parent, { userId }, context) => {
            if (context.user) {

                const checkUser = await User.findOne({ _id: context.user._id });

                console.log(checkUser.following.includes(userId));


                if(checkUser.following.includes(userId)){
                    const pullUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { following: userId } },
                        { new: true }
                    );
    
                    // pull this user from the other users followers array too
                    await User.findByIdAndUpdate(
                        { _id: userId },
                        { $pull: { followers: context.user._id } },
                        { new: true }
                    );
    
                    return pullUser;
                }

                // add to user object that gave the review
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { following: userId } },
                    { new: true }
                );

                // add to novel object that the review was made for
                await User.findByIdAndUpdate(
                    { _id: userId },
                    { $push: { followers: context.user._id } },
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
        },

        removeNovel: async (parent, { novelId }, context) => {
            if (context.user) {

              const userDel = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { novels: novelId } },
                { new: true }
              );

              await Novel.findOneAndDelete({ _id: novelId });

              return userDel;
            }
            throw new AuthenticationError("You need to be logged in!");
        },

        updateNovel: async (parent, args, context) => {
            if (context.user) {
                // if there was no image link given in request, that means that
                // the user is uploading a new book cover.
                console.log('here');
                console.log(args);
                if(!args.imageLink){
                    await cloudinary.uploader
                    .upload(pathName, {
                        resource_type: "image",
                    })
                    .then(async (res) => {
                        console.log("Success!", JSON.stringify(res, null, 2));
                        
                        args.imageLink = res.secure_url;
                        console.log(args.imageLink);
                    })
                    .catch((error) => {
                        console.log("Error!", JSON.stringify(error, null, 2));
                    });
                }

                

                // create novel
                const novel = await Novel.findOneAndUpdate(
                    { _id: args.novelId },
                    { ...args },
                    { new: true }
                  );

                console.log(novel);

                return novel;
            }
            
            throw new AuthenticationError('You need to be logged in!');
        },
    }
}

module.exports = resolvers;