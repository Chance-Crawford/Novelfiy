const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

const novelSchema = new Schema(
  {
    // username of user who made the novel
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