const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const formatDate = require('../utils/formatDate');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => formatDate(timestamp)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validates that an email follows a specific format, if not 
      // send back the error message.
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
    password: {
      type: String,
      required: true,
      minlength: 5
    },
    image: {
      type: String,
    },
    novels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Novel'
      }
    ],
    favoriteNovels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Novel'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    followers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
    ],
    // reviews that this user has given to other books
    givenReviews: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Review'
        }
    ]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

// set up pre-save middleware to hash and create password
// Just like Express.js, Mongoose implements something called middleware to 
// capture our data before getting to or coming from the database and manipulating 
// it. In this case check to see if the data is new or if the password has been 
// modified. This way the same middleware can be used for both new users and users 
// who are updating their information but don't want to update their password values.
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

userSchema.virtual('followerCount').get(function() {
    return this.followers.length;
});

userSchema.virtual('givenReviewCount').get(function() {
    return this.givenReviews.length;
});


const User = model('User', userSchema);

module.exports = User;
