const express = require('express');
const router = express.Router();
const {Comments, Users} = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/comments', authMiddleware, async (req, res) => {
  const {postId} = req.query;
  const {userId} = res.locals.user;
  const {postContent} = req.body;
  if (!postContent) {
    res
      .status(400)
      .send(
        "<script>alert('댓글 내용을 입력하세요.');location.href='localhost:3000/detail';</script>",
      );
  }
  try {
    if (postContent) {
      await Comments.create({
        userId,
        postId,
        content: postContent,
      });

      res
        .status(200)
        .send(
          "<script>alert('댓글 작성에 성공하였습니다.');location.href='http://localhost:3000/detail';</script>",
        );
    } else {
      res
        .status(400)
        .send(
          "<script>alert('댓글 작성에 실패하였습니다.');location.href='http://localhost:3000/detail';</script>",
        );
    }
  } catch (err) {
    res
      .status(400)
      .send(
        "<script>alert('요청한 데이터 형식이 올바르지 않습니다.');location.href='http://localhost:3000/detail';</script>",
      );
  }
});

router.get('/comments', async (req, res) => {
  const {postId} = req.query;
  const allComments = await Comments.findAll({
    where: {postId},
    order: [['createdAt', 'desc']],
    attributes: ['content', 'createdAt', 'updatedAt', 'commentId'],
    include: [{model: Users, attributes: ['nickname']}],
  });

  try {
    if (allComments) {
      return res.status(200).json({allComments});
    } else {
      return res
        .status(400)
        .json({errorMessage: '댓글 조회에 실패하였습니다.'});
    }
  } catch (err) {
    return res
      .status(400)
      .send(
        "<script>alert('요청한 데이터 형식이 올바르지 않습니다.');location.href='http://localhost:3000/detail';</script>",
      );
  }
});

router.patch('/comments', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const {commentId} = req.query;
  const {content} = req.body;
  try {
    const selectComment = await Comments.findOne({where: {commentId}});
    if (content && selectComment.userId == userId) {
      await Comments.update({content}, {where: {commentId}});
      res.status(200).json({message: '댓글 수정에 성공하였습니다.'});
    } else {
      res.status(400).json({message: '댓글 수정에 실패하였습니다.'});
    }
  } catch (err) {
    res.status(400).json({message: '요청한 데이터 형식이 올바르지 않습니다.'});
  }
});

router.delete('/comments', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const {commentId} = req.query;
  try {
    const selectComment = await Comments.findOne({where: {commentId}});
    if (commentId && selectComment.userId == userId) {
      await Comments.destroy({where: {commentId}});
      res.status(200).json({message: '댓글 삭제에 성공하였습니다.'});
    } else {
      res.status(400).json({message: '댓글 삭제에 실패하였습니다.'});
    }
  } catch (err) {
    res.status(400).json({message: '요청한 데이터 형식이 올바르지 않습니다.'});
  }
});

module.exports = router;
