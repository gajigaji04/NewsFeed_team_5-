$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/api/userme',
    data: {},
    success: function (response) {
      getMyInfo(response['myInfo']);
      selectIndex(response);
      modify();
      clickedMyPost();
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
  const $article = document.querySelector('article');
  $article.setAttribute('id', 'article1');
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

  $article.innerHTML = temp_html;
  $('#body').append($article);
}

function getMyPosts(myPosts) {
  $('#article').empty();
  const $article = document.querySelector('article');
  $article.setAttribute('id', 'article2');
  const $myPosts = document.createElement('ul');
  myPosts.forEach(post => {
    let temp_html = `<li id="${post['postId']}" class="myPost">
                          <p>제목: ${post['title']}</p>
                          <p>사용 언어: ${post['language']}</p>
                          <p>작성 날짜: ${post['createdAt']}</p>
                          <p>수정 날짜: ${post['updatedAt']}</p>
                      </li>`;

    $myPosts.innerHTML += temp_html;
  });
  $article.innerHTML = $myPosts.innerHTML;
  $('#body').append($article);
}

function clickedMyPost() {
  $('#body').on('click', function (e) {
    if (e.target.matches('.myPost')) {
      localStorage.setItem('postId', e.target.id);
      location.href = 'http://localhost:3000/detail';
    } else if (e.target.parentNode.className === 'myPost') {
      localStorage.setItem('postId', e.target.parentNode.id);
      location.href = 'http://localhost:3000/detail';
    } else {
      return;
    }
  });
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

$('#home-btn').on('click', function () {
  location.href = 'http://localhost:3000/newsfeeds';
});
