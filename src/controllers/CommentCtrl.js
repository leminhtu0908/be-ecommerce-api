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
  createReplyCommentUser: async (req, res) => {
    try {
      const { username, image, replyComment, id } = req.body;
      const idReply = Math.floor(Math.random() * 1000000000);
      const newReplyComment = {
        username,
        image,
        replyComment,
        idReply,
      };
      await Comment.findOneAndUpdate(
        { _id: id },
        { $push: { reply: newReplyComment } }
      );
      res.status(200).json({ messagess: "Phản hồi thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateReplyCommentUser: async (req, res) => {
    try {
      const { replyComment, id, idReply } = req.body;
      const comment = await Comment.findById({ _id: id });
      const filterReply = comment?.reply?.filter(
        (item) => item.idReply === idReply
      );
      const findReply = comment?.reply?.filter(
        (item) => item.idReply !== idReply
      );
      let converStringReply;
      if (filterReply?.length > 0) {
        converStringReply = filterReply[0];
      }
      const newValues = {
        ...converStringReply,
        replyComment: replyComment,
      };
      findReply.push(newValues);
      const obj = findReply.reduce(function (acc, cur, i) {
        acc[i] = cur;
        return acc;
      }, {});
      console.log(obj);
      await Comment.findOneAndUpdate(
        { _id: id },
        { $push: { rely: [...findReply] } }
      );
      res.json({ messagess: "Cập nhật thành công", result: findReply });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CommentCtrl;
