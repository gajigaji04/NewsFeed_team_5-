const express = require('express');
const router = express.Router();

// 게시글 작성 API
router.post("/posts", async (req, res) => {
    const nickname = res.locals.user.nickname;
    const password = res.locals.user.password;
    console.log("게시글작성");
    console.log(nickname);
    console.log(password);
    const { title, content } = req.body;
    Post.create({ title, content, nickname, password });
    return res.status(201).send(" 게시글을 작성하였습니다.").end();
  });

module.exports = router;
