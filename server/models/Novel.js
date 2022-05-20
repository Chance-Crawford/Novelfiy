const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

const novelSchema = new Schema(
  {
    // id of user who made the novel
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => formatDate(timestamp)
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000
    },
    title: {
      type: String,
      required: true,
      minlength: 1
    },
    penName: {
      type: String
    },
    chapters: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Chapter'
        }
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    reviews: [
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

novelSchema.virtual('reviewCount').get(function() {
    return this.reviews.length;
});

novelSchema.virtual('chapterCount').get(function() {
    return this.chapters.length;
});


const Novel = model('Novel', novelSchema);

module.exports = Novel;