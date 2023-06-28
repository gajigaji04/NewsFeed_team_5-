const express = require('express');
const router = express.Router();
const {Users, Posts} = require("../models");
const posts = require('../models/posts');

let newsFeed = [];

// 전체 뉴스피드 조회
router.get('/allfeeds', async(req, res) => {
  try {
    const allfeeds = await Posts.findAll({
    include: [{
      model: Users,
      attributes: ['nickname'],
    }],
    attributes: ["language", "title", "createdAt", "updatedAt"], 
    order: [['createdAt', 'DESC']]
  });
  res.status(200).json({allfeeds});
  
  if (!allfeeds) {
    return res.status(400).json({errorMessage:"전체 뉴스피드 조회에 실패하였습니다."})
  }
} catch (err) {
console.log(err);
res.status(400).json({errorMessage:"요청한 데이터 형식이 올바르지 않습니다."})
}
});

// 사용자별 특정 분류 뉴스피드 조회
router.get('/userfeeds', async (req, res) => {
  try {
  const { nickname } = req.query;
  const {userId} = await Users.findOne({
    where:{nickname},
    attributes: ["userId"]
  })
  const userfeeds = await Posts.findAll({
    include: [{
      model: Users,
      attributes: ['nickname'],
    }],
    where:{userId},
    attributes: ["language", "title", "createdAt", "updatedAt"],
    order: [['createdAt', 'DESC']]
  })

  if (!userfeeds) {
    return res.status(400).json({errorMessage:"사용자별 뉴스피드 조회에 실패하였습니다."})
  }
  return res.status(200).json({userfeeds})
} catch (err) {
console.log(err);
res.status(400).json({errorMessage:"요청한 데이터 형식이 올바르지 않습니다."})
}
});

// 언어별 특정 분류 뉴스피드 조회
router.get('/langfeeds', async (req, res) => {
  try {
  const { language } = req.query;
  
  const langfeeds = await Posts.findAll({
    include: [{
      model: Users,
      attributes: ['nickname'],
    }],
    where:{language},
    attributes: ["language", "title", "createdAt", "updatedAt"],
    order: [['createdAt', 'DESC']]
  })

  if (!langfeeds) {
    return res.status(400).json({errorMessage:"언어별 뉴스피드 조회에 실패하였습니다."})
  }
  res.status(200).json({langfeeds})
} catch (err) {
console.log(err);
res.status(400).json({errorMessage:"요청한 데이터 형식이 올바르지 않습니다."})
}
});

module.exports = router;
