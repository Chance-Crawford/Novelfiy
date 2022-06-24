const { Schema, model } = require('mongoose');
const formatDate = require('../utils/formatDate');

// reviews made on books hold the review info, id of the novel that the review
// was for, and the id of the user who made review
const chapterSchema = new Schema(
  {
    chapterTitle: {
      type: String,
      required: 'You must have a title for the chapter!',
      minlength: 1
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => formatDate(timestamp)
    },
    chapterText: {
        type: String,
        required: 'You must have text for this chapter!',
        minlength: 1
    },
    // id of the novel that the chapter was made on.
    novelId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Novel'
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
  ],
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const Chapter = model('Chapter', chapterSchema);

module.exports = Chapter;