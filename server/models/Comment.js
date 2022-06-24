const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: 'You need to leave a comment!',
      minlength: 1,
      maxlength: 10000
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => formatDate(timestamp)
    },
    // id of the user who made the comment
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // id of the chapter that the comment was made on.
    chapter: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Chapter'
    },
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;