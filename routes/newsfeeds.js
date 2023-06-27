const express = require('express');
const router = express.Router();

let newsFeed = [];

// 전체 뉴스피드 조회
router.get('/allfeeds', (req, res) => {
  res.json(newsFeed);
});

// 사용자별 뉴스피드 조회
router.post('/userfeeds', (req, res) => {
  const { user, title, content } = req.body;
  const newPost = {
    id: Date.now().toString(),
    user,
    title,
    content
  };
  newsFeed.push(newPost);
  res.status(201).json(newPost);
});

// 언어별 뉴스피드 조회
router.post('/langfeeds', (req, res) => {
  const { language, title, content } = req.body;
  const newPost = {
    id: Date.now().toString(),
    language,
    title,
    content
  };
  newsFeed.push(newPost);
  res.status(200).json(newPost);
});

module.exports = router;
