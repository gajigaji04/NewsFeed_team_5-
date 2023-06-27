const express = require('express');
const CookieParser = require('cookie-parser');

const profileRouter = require('./routes/profile.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(CookieParser());

app.use('/api', [profileRouter]);

app.get('/', (req, res) => {
  res.send('메인페이지');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다!');
});
