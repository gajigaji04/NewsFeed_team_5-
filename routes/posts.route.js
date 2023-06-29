const express = require('express');
const {Op} = require('sequelize');
const {Posts, Users} = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

// //게시물 전체 목록 조회 API
// router.get('/posts', async (req, res) => {
//   const posts = await Posts.findAll({
//     // OME엔 닉네임이라 되어있는데 닉네임이 뭔지 몰라서 일단 title로 찾음
//     // 조립하면서 Users의 테이블을 참조하여 nickname도 받아오게
//     attributes: [
//       'postId',
//       'userId',
//       'title',
//       'createdAt',
//       'updatedAt',
//       'language',
//     ],
//   });

//   if (!posts.length) {
//     return res.status(400).json({
//       message: '게시글 조회에 실패하셨습니다.',
//     });
//   } else {
//     res.status(200).send(posts);
//   }

//   res.status(200).json({data: posts});
// });

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
    attributes: [
      'postId',
      'userId',
      'title',
      'createdAt',
      'updatedAt',
      'language',
      'content',
    ],
  });

  res.status(200).json({data: post});
});

//게시물 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  // 임시 데이터로 userId를 req.body에 넣음. 조립과정에서 팀원들과 논의하여 req.query로 변경될 예정
  // 수정, 삭제도 마찬가지
  const {title, content, language} = req.body;

  if (!language || !title || !content) {
    res
      .status(400)
      .send(
        "<script>alert('데이터 형식이 올바르지 않습니다. 게시글 작성에 실패하였습니다.');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  } else {
    await Posts.create({userId, language, title, content});

    res
      .status(201)
      .send(
        "<script>alert('게시글을 생성하였습니다.');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  }
});

//게시물 수정 API
router.patch('/posts', authMiddleware, async (req, res) => {
  const {postId} = req.query;
  const {userId} = res.locals.user;
  const {title, content, language} = req.body;

  const post = await Posts.findOne({
    where: {postId: postId},
  });

  if (!post) {
    return res.status(400).json({
      message: '게시물이 존재하지 않습니다. 게시글 수정에 실패하였습니다.',
    });
  } else if (post.userId !== userId) {
    return res.status(401).json({
      message:
        '요청한 데이터 형식이 올바르지 않습니다. 게시글 수정에 실패하였습니다.',
    });
  }
  //수정
  await Posts.update(
    {title, content, language},
    {
      where: {
        [Op.and]: [{postId}, {userId}], // 게시글의 userId와 postId가 일치할 때 수정한다.
      },
    },
  );

  return res.status(200).json({message: '게시글이 수정되었습니다.'});
});

// 게시글 삭제
router.delete('/posts', authMiddleware, async (req, res) => {
  const {postId} = req.query;
  const {userId} = res.locals.user;

  const post = await Posts.findOne({where: {postId}});
  if (!post) {
    return res.status(404).json({message: '게시글이 존재하지 않습니다.'});
  } else if (post.userId !== userId) {
    return res.status(401).json({message: 'userId가 일치하지 않습니다.'});
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
