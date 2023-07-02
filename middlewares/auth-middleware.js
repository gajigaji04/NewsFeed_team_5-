const jwt = require('jsonwebtoken');
const {Users} = require('../models');
const secretKey = require('../config/secretKey.json');

module.exports = async (req, res, next) => {
  try {
    const {Authorization} = req.cookies;
    const [authType, authToken] = (Authorization ?? '').split(' ');

    // authToken 검증
    if (authType !== 'Bearer' || !authToken) {
      return res
        .status(403)
        .send(
          "<script>alert('로그인이 필요한 기능입니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // authToken 만료 확인, 서버가 발급한 토큰이 맞는지 확인
    const decodedToken = jwt.verify(authToken, secretKey.key);
    const userId = decodedToken.userId;

    // userId 사용자 DB에 있는지 확인
    const user = await Users.findOne({where: {userId}});
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .send(
        "<script>alert('유효 시간 만료로 자동 로그아웃 되었습니다. 다시 로그인해주세요.');location.href='http://localhost:3000/login';</script>",
      );
  }
};
