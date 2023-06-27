const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {Users} = require('../models');

// 회원 가입 API
router.post('/signup', async (req, res) => {
  try {
    const {email, nickname, pw, pwConfirm, intro} = req.body;

    // 이메일 형식 정의
    const checkEmail =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    // 닉네임 형식 정의 : 알파벳 대소문자(a~z, A~Z), 숫자(0~9), 최소 3자 이상 10자 이하
    const checkNickname = /^[a-zA-Z0-9]{3,10}$/;

    // DB에 존재하는 이메일 확인
    const isExistEmail = await Users.findOne({where: {email}});

    // DB에 존재하는 닉네임 확인
    const isExistNickname = await Users.findOne({where: {nickname}});

    // 이메일, 닉네임 중복 확인
    if (isExistEmail) {
      return res.status(412).json({errorMessage: '중복된 이메일입니다.'});
    } else if (isExistNickname) {
      return res.status(412).json({errorMessage: '중복된 닉네임입니다.'});
    }

    // 이메일, 닉네임 형식 확인
    if (!checkEmail.test(email)) {
      return res
        .status(412)
        .json({errorMessage: '이메일의 형식이 올바르지 않습니다.'});
    } else if (!checkNickname.test(nickname)) {
      return res
        .status(412)
        .json({errorMessage: '닉네임의 형식이 올바르지 않습니다.'});
    }

    // 패스워드 확인 : 닉네임 포함되지 않음, 4자 이상, 확인값과 일치
    if (pw.includes(nickname)) {
      return res
        .status(412)
        .json({errorMessage: '패스워드에 닉네임이 포함되어 있습니다.'});
    } else if (pw.length < 4) {
      return res
        .status(412)
        .json({errorMessage: '패스워드 형식이 올바르지 않습니다.'});
    } else if (pw !== pwConfirm) {
      return res
        .status(412)
        .json({errorMessage: '패스워드가 일치하지 않습니다.'});
    }

    // 5가지 항목 입력 확인
    if (!email || !nickname || !pw || !pwConfirm || !intro) {
      return res
        .status(400)
        .json({errorMessage: '모든 항목을 입력해주셔야 합니다.'});
    }

    // DB에 회원가입 정보 저장
    await Users.create({email, nickname, pw, intro});
    return res.status(201).json({message: '회원 가입에 성공하였습니다.'});
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({errorMessage: '요청한 데이터 형식이 올바르지 않습니다.'});
    return;
  }
});

module.exports = router;
