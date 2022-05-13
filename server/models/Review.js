const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

// reviews made on books hold the review info, id of the novel that the review
// was for, and the id of the user who made review
const reviewSchema = new Schema(
  {
    reviewText: {
      type: String,
      required: 'You need to leave a review!',
      minlength: 1,
      maxlength: 750
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => formatDate(timestamp)
    },
    // id of the user who made the review
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // id of the novel that the review was made on.
    novel: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Novel'
    },
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const Review = model('Review', reviewSchema);

module.exports = Review;