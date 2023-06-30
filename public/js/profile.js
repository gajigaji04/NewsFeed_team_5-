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
      $('#article').css('border', '1px');
      $('#article').css('border-radius', '50px');
      $('#article').css('box-shadow', '0 0 20px grey');
      getMyInfo(response['myInfo']);
    } else if (e.target['id'] === 'posts') {
      $('#article').css('border', '0');
      $('#article').css('border-radius', '0');
      $('#article').css('box-shadow', '0 0 0');
      getMyPosts(response['myPosts']);
    }
  });
}

function getMyInfo(myInfo) {
  $('#article').empty();
  let temp_html = `<div id="myInfo">
                      <div class="infoList">
                        <div id="infoTitle">기본 정보</div>
                        <div class="info"><button id="mdf-btn">수정</button></div>
                      </div>
                      <div class="infoList">
                        <div>
                          <div class="infoName">이메일</div>
                        </div>
                        <div>
                          <input class="info" type="text" value="${myInfo['email']}" readonly>
                        </div>
                      </div>
                      <div class="infoList">
                        <div>
                          <div class="infoName">닉네임</div>
                        </div>
                        <div>
                          <input class="info" id="nickname" type="text" value="${myInfo['nickname']}" readonly>
                        </div>
                      </div>
                      <div class="infoList">
                        <div>
                          <div class="infoName">한 줄 소개</div>
                        </div>
                        <div>
                          <input class="info" id="intro" type="text" value="${myInfo['intro']}" readonly>
                        </div>
                      </div>
                  </div>`;

  $('#article').append(temp_html);
}

function getMyPosts(myPosts) {
  $('#article').empty();
  const $myPosts = document.createElement('ul');
  myPosts.forEach(post => {
    let temp_html = `<li class="myPost">
                          <p>제목: ${post['title']}</p>
                          <p>사용 언어: ${post['language']}</p>
                          <p>작성 날짜: ${post['createdAt']}</p>
                          <p>수정 날짜: ${post['updatedAt']}</p>
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
