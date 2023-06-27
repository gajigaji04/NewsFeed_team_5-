const express = require('express');
const CookieParser = require('cookie-parser');

const app = express();
const port = 3000;
<<<<<<< HEAD
=======

>>>>>>> 025f10cc711b882f4cc2a7f7bae1cceab1ae57f9
const usersRouter = require('./routes/users.js');
const profileRouter = require('./routes/profile.js');
const postsRouteRouter = require('./routes/posts.route');

app.use(express.json());
app.use(CookieParser());


app.use('/api', [usersRouter, postsRouteRouter, profileRouter]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});
