const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

module.exports = {
  smtpTransport,
};
