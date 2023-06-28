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
        .json({errorMessage: '모든 항목을 입력해주셔야 합니다.'});
    }

    // 이메일 검증
    if (!checkEmail.test(email)) {
      return res
        .status(412)
        .json({errorMessage: '이메일의 형식이 올바르지 않습니다.'});
    } else if (isExistEmail) {
      return res.status(412).json({errorMessage: '중복된 이메일입니다.'});
    }

    // 닉네임 검증
    if (!checkNickname.test(nickname)) {
      return res
        .status(412)
        .json({errorMessage: '닉네임의 형식이 올바르지 않습니다.'});
    } else if (isExistNickname) {
      return res.status(412).json({errorMessage: '중복된 닉네임입니다.'});
    }

    // 패스워드 확인 : 닉네임 포함되지 않음, 4자 이상, 확인값과 일치
    if (pw !== pwConfirm) {
      return res
        .status(412)
        .json({errorMessage: '패스워드가 일치하지 않습니다.'});
    } else if (pw.length < 4) {
      return res
        .status(412)
        .json({errorMessage: '패스워드 형식이 올바르지 않습니다.'});
    } else if (pw.includes(nickname)) {
      return res
        .status(412)
        .json({errorMessage: '패스워드에 닉네임이 포함되어 있습니다.'});
    }

    // DB에 회원가입 정보 저장 + 비밀번호 암호화
    await Users.create({email, nickname, pw: hashedPw, intro});
    return res.status(201).json({message: '회원 가입에 성공하였습니다.'});
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({errorMessage: '요청한 데이터 형식이 올바르지 않습니다.'});
    return;
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  try {
    const {email, pw} = req.body;

    // 이메일 일치하는 유저 찾기
    const user = await Users.findOne({where: {email}});

    // 이메일 일치하지 않거나 패스워드 일치하지 않을 때
    if (!user || user.pw !== pw) {
      return res.status(412).json({errorMessage: '로그인에 실패하였습니다.'});
    }

    // JWT 생성 : 토큰 만료 시간 1시간
    const token = jwt.sign({userId: user.userId}, 'customized-secret-key', {
      expiresIn: '1h',
    });

    res.cookie('Authorization', `Bearer ${token}`);
    res.status(200).json({token});
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({errorMessage: '요청한 데이터 형식이 올바르지 않습니다.'});
    return;
  }
});

module.exports = router;
