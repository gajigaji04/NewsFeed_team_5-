$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/api/userme',
    data: {},
    success: function (response) {
      getMyInfo(response['myInfo']);
      selectIndex(response);
      modify();
    },
    error: function (response) {
      alert(response.responseJSON['errorMessage']);
    },
  });
});

function selectIndex(response) {
  $('#nav').on('click', function (e) {
    if (e.target['id'] === 'account') {
      getMyInfo(response['myInfo']);
    } else if (e.target['id'] === 'posts') {
      getMyPosts(response['myPosts']);
    }
  });
}

function getMyInfo(myInfo) {
  $('#article').empty();
  let temp_html = `<div id="myInfo">
                      <input type="text" value="${myInfo['email']}" readonly>
                      <input id="nickname" type="text" value="${myInfo['nickname']}" readonly>
                      <input id="intro" type="text" value="${myInfo['intro']}" readonly>
                      <button id="mdf-btn">수정</button>
                  </div>`;

  $('#article').append(temp_html);
}

function getMyPosts(myPosts) {
  $('#article').empty();
  const $myPosts = document.createElement('ul');
  myPosts.forEach(post => {
    let temp_html = `<li class="myPost">
                          <p>${post['title']}</p>
                          <p>${post['language']}</p>
                          <p>${post['createdAt']}</p>
                          <p>${post['updatedAt']}</p>
                      </li>`;

    $myPosts.innerHTML += temp_html;
  });
  $('#article').append($myPosts);
}

let duplicationCheck = true;
function modify() {
  const beforeNickname = $('#nickname').val();
  $('#mdf-btn').on('click', function () {
    // console.log('aaa');
    if (duplicationCheck === true) {
      $('#nickname').removeAttr('readonly');
      $('#nickname').select();
      $('#intro').removeAttr('readonly');

      $('#mdf-btn').text('수정하기');
      duplicationCheck = false;
    } else {
      const nickname = $('#nickname').val();
      const intro = $('#intro').val();
      $.ajax({
        type: 'PATCH',
        url: '/api/userme',
        data: {nickname, intro},
        success: function (response) {
          $('#mdf-btn').text('수정');
          $('#nickname').attr('readonly', '');
          $('#intro').attr('readonly', '');

          duplicationCheck = true;
          alert('수정완료');
        },
        error: function (response) {
          $('#nickname').val(beforeNickname);
          $('#mdf-btn').text('수정');
          $('#nickname').attr('readonly', '');
          $('#intro').attr('readonly', '');
          duplicationCheck = true;
          alert(response.responseJSON['errorMessage']);
        },
      });
    }
  });
}
