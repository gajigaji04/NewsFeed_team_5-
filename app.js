const express = require('express');
const app = express();
const port = 3000;
const commentsRouter = require('./routes/comments.route');

app.listen(port, () => {
  console.log(port, '로 서버가 열렸습니다!');
});

app.get('/', (req, res) => {
  res.send('메인페이지');
});

app.use(express.json());
app.use('/api', [commentsRouter]);
