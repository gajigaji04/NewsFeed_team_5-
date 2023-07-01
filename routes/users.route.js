const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {Users} = require('../models');
const {smtpTransport} = require('../config/email.js');
const secretKey = require('../config/secretKey.json');

// 이메일 인증 API
router.post('/authEmail', async (req, res) => {
  try {
    const {email} = req.body;

    // 이메일 형식 정의
    const checkEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    // DB에 존재하는 이메일 확인
    const isExistEmail = await Users.findOne({where: {email}});

    // min~max 랜덤 숫자 생성(인증 번호)
    const randomNumber = (min, max) => {
      let num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num;
    };

    const number = randomNumber(111111, 999999);

    // 이메일 검증
    if (!email) {
      return res.status(400).json({
        message: '이메일을 입력해 주세요.',
      });
    } else if (!checkEmail.test(email)) {
      return res.status(412).json({
        message: '이메일의 형식이 올바르지 않습니다.',
      });
    } else if (isExistEmail) {
      return res.status(412).json({
        message: '이미 가입된 이메일 계정입니다.',
      });
    }

    // 인증 메일 내용
    const mailOptions = {
      from: 'oem.project.team@gmail.com',
      to: email,
      subject: '[OEM Team] 가입 인증 관련 이메일입니다.',
      html: `인증 번호 [${number}]를 입력해주세요. 인증 번호 유효 시간은 10분입니다.`,
    };

    smtpTransport.sendMail(mailOptions, (err, res) => {
      if (err) {
        res.status(500).json({
          message: '예상치 못한 오류로 인해 이메일 전송에 실패하였습니다.',
        });
      }
    });

    // JWT 생성 : 토큰 만료 시간 10분
    const token = jwt.sign({number}, secretKey.key, {
      expiresIn: '10m',
    });

    res.cookie('Authorization', `Bearer ${token}`);
    res.status(201).json({
      message:
        '입력하신 이메일로 인증 번호가 발송되었습니다. 10분 안에 인증 번호를 입력해주세요.',
    });
    return;
  } catch (err) {
    return res.status(500).json({
      message: '예상치 못한 오류로 인해 이메일 전송에 실패하였습니다.',
    });
  }
});

// 인증 번호 일치 확인 API
router.post('/authNumber', (req, res) => {
  try {
    const {authNumber} = req.body;

    // 인증 번호 토큰이 맞는지 확인
    const {Authorization} = req.cookies;
    const [authType, authToken] = (Authorization ?? '').split(' ');

    // authToken 만료 확인, 서버가 발급한 토큰이 맞는지 확인
    const decodedToken = jwt.verify(authToken, secretKey.key);

    // 이메일로 전송된 인증 번호 확인
    if (!authNumber) {
      return res.status(404).json({message: '인증 번호를 입력해주세요.'});
    } else if (Number(authNumber) !== decodedToken.number) {
      return res.status(404).json({
        message: '인증 번호가 일치하지 않습니다.',
      });
    }
    res.status(201).json({message: '인증에 성공했습니다.'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: '예상치 못한 오류로 인해 인증 번호 일치 확인에 실패하였습니다.',
    });
  }
});

// 회원 가입 API
router.post('/signup', async (req, res) => {
  try {
    const {email, nickname, pw, pwConfirm, intro} = req.body;

    // 닉네임 형식 정의 : 알파벳 대소문자, 숫자, 한글, 띄어쓰기 포함 3자 이상 10자 이하
    const checkNickname = /^[0-9a-zA-Zㄱ-ㅎ가-힣 ]{3,10}$/;

    // DB에 존재하는 닉네임 확인
    const isExistNickname = await Users.findOne({where: {nickname}});

    // 비밀번호 암호화
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPw = await bcrypt.hash(pw, salt);

    // 5가지 항목 입력 확인
    if (!email || !nickname || !pw || !pwConfirm || !intro) {
      return res.status(400).json({
        message: '모든 항목을 입력해 주셔야 됩니다.',
      });
    }

    // 닉네임 검증
    if (!checkNickname.test(nickname)) {
      return res.status(412).json({
        message: '닉네임의 형식이 올바르지 않습니다.',
      });
    } else if (isExistNickname) {
      return res.status(412).json({
        message: '중복된 닉네임입니다.',
      });
    }

    // 패스워드 확인 : 닉네임 포함되지 않음, 4자 이상, 확인값과 일치
    if (pw !== pwConfirm) {
      return res.status(412).json({
        message: '비밀번호가 일치하지 않습니다.',
      });
    } else if (pw.length < 4) {
      return res.status(412).json({
        message: '비밀번호 형식이 올바르지 않습니다.',
      });
    } else if (pw.includes(nickname)) {
      return res.status(412).json({
        message: '비밀번호에 닉네임이 포함되어 있습니다.',
      });
    }

    // DB에 회원가입 정보 저장 + 비밀번호 암호화
    await Users.create({email, nickname, pw: hashedPw, intro});
    return res.status(201).json({
      message: '회원가입에 성공하였습니다. 로그인 후에 이용해 주세요.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: '예상치 못한 오류로 인해 회원가입에 실패하였습니다.',
    });
    return;
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  try {
    const {email, pw} = req.body;

    // 이메일 일치하는 유저 찾기
    const user = await Users.findOne({where: {email}});

    if (!user) {
      return res
        .status(412)
        .send(
          "<script>alert('이메일이나 패스워드가 일치하지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // 비밀번호 검증
    const match = await bcrypt.compare(pw, user.pw);

    if (!match) {
      return res
        .status(412)
        .send(
          "<script>alert('이메일이나 패스워드가 일치하지 않습니다.');location.href='http://localhost:3000/login';</script>",
        );
    }

    // JWT 생성 : 토큰 만료 시간 1시간
    const token = jwt.sign({userId: user.userId}, secretKey.key, {
      expiresIn: '1h',
    });

    res.cookie('Authorization', `Bearer ${token}`);
    res
      .status(200)
      .send(
        "<script>alert('로그인 되었습니다.');localStorage.setItem('login','1');location.href='http://localhost:3000/newsfeeds';</script>",
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(
        "<script>alert('예상치 못한 오류로 인해 로그인에 실패하였습니다.');location.href='http://localhost:3000/login';</script>",
      );
    return;
  }
});

// 로그아웃 API
router.post('/logout', (req, res) => {
  try {
    return res
      .clearCookie('Authorization')
      .status(200)
      .json({message: '로그아웃 되었습니다.'});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({message: '에상치 못한 오류로 인해 로그아웃에 실패하였습니다.'});
  }
});

module.exports = router;
