const express = require('express');
const {Op} = require('sequelize');
const {Posts, Users} = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

//게시물 상세 목록 조회 API
router.get('/posts', async (req, res) => {
  const {postId} = req.query;
  const post = await Posts.findOne({
    include: [
      {
        model: Users,
        attributes: ['nickname'],
      },
    ],
    where: {postId: postId},
  });

  res.status(200).json({data: post});
});

//게시물 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const {title, content, language} = req.body;
  const likes = 0;

  if (!language || !title || !content) {
    res
      .status(400)
      .send(
        "<script>alert('모든 항목을 입력해주셔야 합니다.');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  } else {
    await Posts.create({userId, language, title, content, likes});

    res
      .status(201)
      .send(
        "<script>alert('게시글을 생성하였습니다.');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  }
});

//게시물 수정 API
router.patch('/posts/:postId', authMiddleware, async (req, res) => {
  const {postId} = req.params;
  const {userId} = res.locals.user;
  const {title, content, language} = req.body;

  const post = await Posts.findOne({
    where: {postId: postId},
  });

  if (!post) {
    return res
      .status(400)
      .send(
        "<script>alert('게시글물이 존재하지 않습니다. 수정에 실패하였습니다.');location.href='http://localhost:3000/detail';</script>",
      );
  } else if (post.userId !== userId) {
    return res
      .status(401)
      .send(
        "<script>alert('게시물 수정 권한이 없습니다.');location.href='http://localhost:3000/detail';</script>",
      );
  }
  //수정  게시글의 userId와 postId가 일치할 때 수정
  await Posts.update(
    {title, content, language},
    {
      where: {
        [Op.and]: [{postId}, {userId}],
      },
    },
  );

  return res
    .status(200)
    .send(
      "<script>alert('게시글이 수정되었습니다.');location.href='http://localhost:3000/detail';</script>",
    );
});

// 게시글 삭제
router.delete('/posts', authMiddleware, async (req, res) => {
  const {postId} = req.query;
  const {userId} = res.locals.user;

  const post = await Posts.findOne({where: {postId}});
  if (!post) {
    return res.status(404).json({message: '게시글이 존재하지 않습니다.'});
  } else if (post.userId !== userId) {
    return res.status(401).json({message: '게시물 삭제 권한이 없습니다.'});
  }

  //식제
  await Posts.destroy({
    where: {
      [Op.and]: [{postId}, {userId}],
    },
  });

  res.status(200).json({message: '게시글이 삭제되었습니다.'});
});

module.exports = router;
