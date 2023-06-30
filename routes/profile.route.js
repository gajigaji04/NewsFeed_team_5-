const express = require('express');

const {Users, Posts, Op} = require('../models');
const authMiddleware = require('../middlewares/auth-middleware.js');

const router = express.Router();

router.get('/userme', authMiddleware, async (req, res) => {
  try {
    const {userId} = res.locals.user;

    if (!userId) {
      return res
        .status(400)
        .json({errorMessage: '로그인 후 이용 가능한 기능입니다.'});
    }

    const users = await Users.findOne({
      attributes: ['email', 'nickname', 'intro'],
      where: {userId},
    });

    if (!users) {
      return res
        .status(400)
        .json({errorMessage: '프로필 조회에 실패하였습니다.'});
    }

    const myPosts = await Posts.findAll({
      attributes: [
        'postId',
        'userId',
        'title',
        'content',
        'language',
        'createdAt',
        'updatedAt',
      ],
      where: {userId},
      order: [['createdAt', 'DESC']],
    });

    if (!myPosts) {
      return res
        .status(400)
        .json({errorMessage: '작성한 게시글 조회에 실패하였습니다.'});
    }
    res.status(200).json({myInfo: users, myPosts});
  } catch (err) {
    console.error(err);
    res.status(400).json({
      errorMessage: '예기치 못한 오류로 인해 프로필 조회에 실패하였습니다.',
    });
  }
});

router.patch('/userme', authMiddleware, async (req, res) => {
  try {
    const {userId} = res.locals.user;
    const {nickname, intro} = req.body;

    const isExistNickname = await Users.findAll({
      attributes: ['nickname'],
      where: {
        nickname,
      },
    });

    if (!userId) {
      return res
        .status(400)
        .json({errorMessage: '로그인 후 이용 가능한 기능입니다.'});
    } else if (!nickname || !intro) {
      return res
        .status(400)
        .json({errorMessage: '데이터 형식이 올바르지 않습니다.'});
    } else if (isExistNickname.length) {
      return res
        .status(400)
        .json({errorMessage: '사용할 수 없는 닉네임입니다.'});
    }

    await Users.update(
      {
        nickname,
        intro,
      },
      {
        where: {userId},
      },
    );

    res.status(200).json({message: '프로필 수정에 성공하였습니다.'});
  } catch (err) {
    console.error(err);
    res.status(400).json({
      errorMessage: '예기치 못한 오류로 인해 프로필 수정에 실패하였습니다.',
    });
  }
});

module.exports = router;
