const express = require('express');
const router = express.Router();
const {Posts, Comments} = require('../models');

router.post('/comments', async (req, res) => {
  // const {postId} = req.query;
  const {postContent, userId, postId} = req.body;

  // 나중에 res.locals.user 에서 닉네임 받아올 예정
  // const { nickname } = res.locals.user;
  // 나중에 !post 유효성 검사
  // const post = await Posts.findOne({where: {postId}});

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
  const allComments = await Comments.findAll({
    order: [['createdAt', 'desc']],
    attributes: ['content', 'createdAt', 'updatedAt'],
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

router.patch('/comments', async (req, res) => {
  const {commentId} = req.query;
  const {editContent} = req.body;
  try {
    if (editContent && commentId) {
      await Comments.update({content: editContent}, {where: {userId}});
      res
        .status(200)
        .send(
          "<script>alert('댓글 수정에 성공하였습니다.');location.href='http://localhost:3000/detail';</script>",
        );
    } else {
      res
        .status(400)
        .send(
          "<script>alert('댓글 수정에 실패하였습니다.');location.href='http://localhost:3000/detail';</script>",
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

router.delete('/comments', async (req, res) => {
  const {userId} = req.query;
  try {
    if (userId) {
      await Comments.destroy({where: {userId}});
      res
        .status(200)
        .send(
          "<script>alert('댓글 삭제에 성공하였습니다.');location.href='http://localhost:3000/detail';</script>",
        );
      return res.redirect('/detail');
    } else {
      res
        .status(400)
        .send(
          "<script>alert('댓글 삭제에 실패하였습니다.');location.href='http://localhost:3000/detail';</script>",
        );
      return res.redirect('/detail');
    }
  } catch (err) {
    res
      .status(400)
      .send(
        "<script>alert('요청한 데이터 형식이 올바르지 않습니다.');location.href='http://localhost:3000/detail';</script>",
      );
    return res.redirect('/detail');
  }
});

module.exports = router;
