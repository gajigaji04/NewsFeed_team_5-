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

app.use(express.json());
app.use(CookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', [
  usersRouter,
  postsRouteRouter,
  profileRouter,
  newsfeedsRouter,
  commentsRouter,
]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/html/login.html');
});

app.get('/detail', (req, res) => {
  res.sendFile(__dirname + '/html/detail.html');
});

app.get('/newsfeed', (req, res) => {
  res.sendFile(__dirname + '/html/newsfeed.html');
});

app.get('/js/detailComments', (req, res) => {
  res.sendFile(__dirname + '/js/detailComments.js');
});

app.get('/js/detailPosts', (req, res) => {
  res.sendFile(__dirname + '/js/detailPosts.js');
});

app.get('/css/detail', (req, res) => {
  res.sendFile(__dirname + '/css/detail.css');
});

app.get('/css/login', (req, res) => {
  res.sendFile(__dirname + '/css/login.css');
});

// 테이블이 없는 경우 모델 기반으로 테이블 생성
const {sequelize} = require('./models/index.js');

async function main() {
  await sequelize.sync();
}

main();
