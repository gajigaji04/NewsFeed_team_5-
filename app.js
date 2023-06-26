const express = require('express');
const CookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const postsRoutr = require('./routes/posts.route');

app.use(express.json());
app.use(CookieParser.json());

app.use('/api', [postsRoutr]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});
