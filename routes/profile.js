const express = require('express');

const {Users} = require('../models');

const router = express.Router();

router.get('/userme', async (req, res) => {
  const {userId} = req.query;

  const users = await Users.findOne({
    attributes: ['email', 'nickname', 'intro'],
    where: {userId},
  });

  res.status(200).json({data: users});
});

module.exports = router;
