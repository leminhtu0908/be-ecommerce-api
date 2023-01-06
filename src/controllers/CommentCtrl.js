const Comment = require("../models/commentModel");
const Product = require("../models/productModel");

const CommentCtrl = {
  createCommentUser: async (req, res) => {
    try {
      const { userId, content, productId } = req.body;
      const newComment = {
        user: userId,
        content,
        product_id: productId,
      };
      const addComment = await new Comment(newComment).save();
      await addComment.populate([
        {
          path: "user",
          select: "_id email fullName image",
        },
      ]);
      res.status(200).json({ comment: addComment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllComments: async (req, res) => {
    try {
      const { product_id } = req.query;
      const comments = await Comment.find({ product_id: product_id })
        .populate([
          {
            path: "user",
            select: "_id email fullName image",
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json({ comments: comments });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content, id } = req.body;
      const comment = await Comment.findOneAndUpdate(
        { _id: id },
        { content },
        { new: true }
      );
      res.json({ comment: comment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      await Comment.findByIdAndRemove(id);
      res.json({ messagess: " Xóa thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CommentCtrl;
