const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
