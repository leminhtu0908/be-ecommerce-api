const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema(
  {
    content: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
