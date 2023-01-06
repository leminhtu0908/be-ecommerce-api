const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    content: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: String,
    },
    parent: [],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
