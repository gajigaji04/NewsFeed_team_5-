const allfeeds = 'allfeeds';
const langfeeds = 'langfeeds?language=';
const userfeeds = 'userfeeds?nickname=';
const container = document.querySelector('#container');
const newsfeed = document.querySelector('#newsfeed');
const iflogined = document.querySelector('#iflogined');

document.addEventListener('DOMContentLoaded', listing(allfeeds));

$(document).ready(function () {
  $('#profilebutton').on('click', function () {
    location.href = '/profile';
  });
});

// 피드 리스팅
async function listing(feedname) {
  const input = document.querySelector('#feedinput').value;
  let uri = feedname + input;
  if (feedname == allfeeds) {
    uri = feedname;
  }
  const response = await fetch(`http://localhost:3000/api/${uri}`);
  const feed = await response.json();
  newsfeed.innerHTML = feed.feeds
    .map(post => {
      return `<div id = "postbox">
                <div class ="postbox${post.postId}" id ="${post.postId}">
                    <h3 class ="postbox${post.postId}" id ="${post.postId}">${post.title}</h3>
                    <div class ="postbox${post.postId}" id ="${post.postId}">작성자: ${post.User.nickname}</div>
                    <div class ="postbox${post.postId}" id ="${post.postId}">언어 : ${post.language}</div>
                    <div class ="postbox${post.postId}" id ="${post.postId}">작성 시간 : ${post.createdAt}</div>
                    <div class ="postbox${post.postId}" id ="${post.postId}">수정 시간 : ${post.updatedAt}</div>
                </div>
                </div>
                `;
    })
    .join('');
}

// 로그인 했다면 새 글 작성/로그아웃/프로필 버튼을 보여줌
const ifloginedornot = localStorage.getItem('login');
if (ifloginedornot == '1') {
  iflogined.innerHTML = `
                        <button class="headerbutton" id="openmodal">새 글 작성</button>
                        <button onclick="logoutfunc()" class="headerbutton">로그아웃</button>
                        <button class="headerbutton" id="profilebutton">프로필</button>
                        
                        <div class="modal">
                          <div id="modal-content">
                          <div id ="modalheader">
                          <button class="close-modal"id ="closenewpostbtn">X</button>
                          </div>
                            <form action="/api/posts" method="POST">
                            <h3>새 글 작성하기</h3>
                            
                            <div id = "modalcontent">
                                <label>제목</label>
                                <input type="text" name="title" />
                            </div>
                            
                            <div id = "modalcontent">
                                <label>언어</label>
                                <input type="text" name="language" />
                            </div>
                            
                            <div id = "modalcontent">
                                <label>내용</label>
                                <textarea class="editor" name="content"></textarea>
                            </div>
                            <button type="submit" id ="newpostbtn">작성</button>
                            </form>
                            
                          </div>
                        </div>
                        
                            `;
}

container.addEventListener('click', ({target}) => {
  if (target.matches(`.postbox${target.id}`)) {
    localStorage.setItem('postId', target.id);
    location.href = 'http://localhost:3000/detail';
  }
  if (target.matches(`#openmodal`)) {
    const modal = document.querySelector(`.modal`);
    modal.style.display = 'block';
  }
  if (target.matches('.close-modal')) {
    const modal = document.querySelector(`.modal`);
    modal.style.display = 'none';
  }
});

// 로그아웃
async function logoutfunc() {
  const response = await fetch('http://localhost:3000/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const message = await response.json();
  alert(message.message);
  localStorage.setItem('login', '0');
  window.location.reload();
}

// 회원가입/로그인
function loginfunc() {
  location.href = 'http://localhost:3000/login';
}

// 검색 기능
async function search() {
  const response = await fetch(`http://localhost:3000/api/allfeeds`);
  const feed = await response.json();
  const input = document.querySelector('#feedinput').value;
  newsfeed.innerHTML = feed.feeds
    .map(post => {
      if (post.content.includes(input)) {
        return `
                <div id = "postbox">
                  <div class ="postbox${post.postId}" id ="${post.postId}">
                      <h3 class ="postbox${post.postId}" id ="${post.postId}">${post.title}</h3>
                      <div class ="postbox${post.postId}" id ="${post.postId}">작성자: ${post.User.nickname}</div>
                      <div class ="postbox${post.postId}" id ="${post.postId}">언어 : ${post.language}</div>
                      <div class ="postbox${post.postId}" id ="${post.postId}">작성 시간 : ${post.createdAt}</div>
                      <div class ="postbox${post.postId}" id ="${post.postId}">수정 시간 : ${post.updatedAt}</div>
                  </div>
                </div>
                `;
      } else {
        return;
      }
    })
    .join('');
}
