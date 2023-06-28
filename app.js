const express = require('express');
const CookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const usersRouter = require('./routes/users.js');
const newsfeedsRouter = require('./routes/newsfeeds.js');
const postsRouteRouter = require('./routes/posts.route');
const profileRouter = require('./routes/profile.js');

app.use(express.json());
app.use(CookieParser());

app.use('/api', [usersRouter, postsRouteRouter, profileRouter, newsfeedsRouter]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});
