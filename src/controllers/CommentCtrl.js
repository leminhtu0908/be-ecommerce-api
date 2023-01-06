const Comment = require("../models/commentModel");
const Product = require("../models/productModel");

const CommentCtrl = {
  createCommentUser: async (req, res) => {
    try {
      const { userId, content, productId } = req.body;
      const newComment = {
        user: userId,
        content,
      };
      const addComment = await new Comment(newComment).save();
      await addComment.populate([
        {
          path: "user",
          select: "_id email fullName image",
        },
      ]);
      await Product.findOneAndUpdate(
        { _id: productId },
        { $push: { comments: newComment } }
      );
      res.status(200).json({ comment: addComment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CommentCtrl;
