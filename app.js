const express = require('express');
const CookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const usersRouter = require('./routes/users.js');

const newsfeedsRouter = require('./routes/newsfeeds.js');
const postsRouteRouter = require('./routes/posts.route');
const profileRouter = require('./routes/profile.js');
const commentsRouter = require('./routes/comments.route');
const likesRouter = require('./routes/likes.route.js');

app.use(express.json());
app.use(CookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use('/api', [
  usersRouter,
  postsRouteRouter,
  profileRouter,
  newsfeedsRouter,
  commentsRouter,
  likesRouter,
]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/html/login.html');
});

app.get('/detail', (req, res) => {
  res.sendFile(__dirname + '/html/detail.html');
});

app.get('/newsfeeds', (req, res) => {
  res.sendFile(__dirname + '/html/newsfeeds.html');
});

// 테이블이 없는 경우 모델 기반으로 테이블 생성
const {sequelize} = require('./models/index.js');

async function main() {
  await sequelize.sync();
}

main();
