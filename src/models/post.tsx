import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  reactions: {
    thumbsUp: {
      type: Number,
      default: 0,
    },
    smiley: {
      type: Number,
      default: 0,
    },
    favorite: {
      type: Number,
      default: 0,
    },
    heart: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
