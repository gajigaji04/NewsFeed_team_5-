const express = require('express');
const CookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const commentsRouter = require('./routes/comments.route');

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(CookieParser());

app.use('/api', [commentsRouter]);

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});

app.get('/detail', (req, res) => {
  res.sendFile(__dirname + '/html/detail.html');
});

// 테이블이 없는 경우 모델 기반으로 테이블 생성
const {sequelize} = require('./models/index.js');

async function main() {
  await sequelize.sync();
}

main();
