const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {Users} = require('../models');

// 회원 가입 API
router.post('/signup', async (req, res) => {
  try {
    const {email, nickname, pw, pwConfirm, intro} = req.body;

    // 이메일 형식 정의
    const checkEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    // 닉네임 형식 정의 : 알파벳 대소문자, 숫자, 한글, 띄어쓰기 포함 3자 이상 10자 이하
    const checkNickname = /^[0-9a-zA-Zㄱ-ㅎ가-힣 ]{3,10}$/;

    // DB에 존재하는 이메일 확인
    const isExistEmail = await Users.findOne({where: {email}});

    // DB에 존재하는 닉네임 확인
    const isExistNickname = await Users.findOne({where: {nickname}});

    // 비밀번호 암호화
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPw = await bcrypt.hash(pw, salt);

    // 5가지 항목 입력 확인
    if (!email || !nickname || !pw || !pwConfirm || !intro) {
      return res
        .status(400)
        .send(
          "<script>alert('모든 항목을 입력해 주셔야 합니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // 이메일 검증
    if (!checkEmail.test(email)) {
      return res
        .status(412)
        .send(
          "<script>alert('이메일의 형식이 올바르지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    } else if (isExistEmail) {
      return res
        .status(412)
        .send(
          "<script>alert('중복된 이메일입니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // 닉네임 검증
    if (!checkNickname.test(nickname)) {
      return res
        .status(412)
        .send(
          "<script>alert('닉네임의 형식이 올바르지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    } else if (isExistNickname) {
      return res
        .status(412)
        .send(
          "<script>alert('중복된 닉네임입니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // 패스워드 확인 : 닉네임 포함되지 않음, 4자 이상, 확인값과 일치
    if (pw !== pwConfirm) {
      return res
        .status(412)
        .send(
          "<script>alert('비밀번호가 일치하지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    } else if (pw.length < 4) {
      return res
        .status(412)
        .send(
          "<script>alert('비밀번호 형식이 올바르지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    } else if (pw.includes(nickname)) {
      return res
        .status(412)
        .send(
          "<script>alert('비밀번호에 닉네임이 포함되어 있습니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // DB에 회원가입 정보 저장 + 비밀번호 암호화
    await Users.create({email, nickname, pw: hashedPw, intro});
    return res
      .status(201)
      .send(
        "<script>alert('회원가입에 성공하였습니다. 로그인 후 사용하세요.');location.href='http://localhost:3000/login';</script>",
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(
        "<script>alert('요청한 데이터의 형식이 올바르지 않습니다.');location.href='http://localhost:3000/login';</script>",
      );
    return;
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  try {
    const {email, pw} = req.body;

    // 이메일 일치하는 유저 찾기
    const user = await Users.findOne({where: {email}});

    const match = await bcrypt.compare(pw, user.pw);

    // 이메일 일치하지 않거나 패스워드 일치하지 않을 때
    if (!user || !match) {
      return res
        .status(412)
        .send(
          "<script>alert('로그인에 실패하였습니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // JWT 생성 : 토큰 만료 시간 1시간
    const token = jwt.sign({userId: user.userId}, 'customized-secret-key', {
      expiresIn: '1h',
    });

    res.cookie('Authorization', `Bearer ${token}`);
    res
      .status(200)
      .send(
        "<script>alert('로그인에 성공하였습니다.');localStorage.setItem('login','1');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send(
        "<script>alert('로그인에 실패하였습니다.');location.href='http://localhost:3000/login';</script>",
      );
    return;
  }
});

// 로그아웃 API
router.get('/logout', (req, res) => {
  return res
    .clearCookie('Authorization')
    .status(200)
    .json({message: '로그아웃 되었습니다.'});
});

module.exports = router;
