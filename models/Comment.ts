import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
