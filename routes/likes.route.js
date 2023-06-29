const express = require('express');
const router = express.Router();
const {Posts} = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

router.patch('/likes', authMiddleware, async (req, res) => {
  const {postId} = req.body;
  const post = await Posts.findOne({
    where: {postId},
  });

  const {userId} = res.locals.user;
  if (post.userId == userId) {
    res.status(400).json({message: '본인의 게시글은 좋아요 할 수 없습니다.'});
  } else {
    await Posts.update(
      {likes: post.likes + 1},
      {
        where: {postId},
      },
    );
    res.status(200).json({message: '좋아요가 반영되었습니다.'});
  }
});

router.patch('/unlikes', authMiddleware, async (req, res) => {
  const {postId} = req.body;
  const post = await Posts.findOne({
    where: {postId},
  });

  const {userId} = res.locals.user;
  if (post.userId == userId) {
    res.status(400).json({message: '본인의 게시글은 좋아요 할 수 없습니다.'});
  } else {
    await Posts.update(
      {likes: post.likes - 1},
      {
        where: {postId},
      },
    );
    res.status(200).json({message: '좋아요 취소가 반영되었습니다.'});
  }
});
module.exports = router;
