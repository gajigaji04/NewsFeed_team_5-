const $login = document.querySelector('#login');
const $email = document.querySelector('#email');
const $pw = document.querySelector('#pw');

$(document).ready(() => {
  // login();
});

// function login() {
//   $login.addEventListener('submit', () => {
//     // $.ajax({
//     //   type: 'POST',
//     //   ulr: 'localhost:3000/api/login',
//     //   data: {'email': }
//     // })
//     console.log('abc');
//   });
// }

$login.addEventListener('submit', e => {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    ulr: 'localhost:3000/api/login',
    data: {email: $email.value, pw: $pw.value},
    success: response => {
      console.log(response);
    },
  });
});
