$(document).ready(() => {
  getMyInfo();
  console.log('aaa');
});

function getMyInfo() {
  $.ajax({
    type: 'GET',
    url: 'localhost:3000/api/userme',
    data: {},
    success: response => {
      console.log(response);
    },
  });
}
