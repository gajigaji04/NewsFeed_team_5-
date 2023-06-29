document.addEventListener('DOMContentLoaded', postListing);
async function postListing() {
  const pagetitle = document.querySelector('#pagetitle');
  const detailPost = document.querySelector('#detailPost');
  const postId = localStorage.getItem('postId');
  const response = await fetch(
    `http://localhost:3000/api/posts?postId=${postId}`,
  );
  const post = await response.json();
  console.log(post);
  pagetitle.innerHTML = `${post.data.title}`;
  if (!post) {
    detailPost.innerHTML = post.message;
  } else {
    detailPost.innerHTML = `
    <header>
    <input type="hidden" id="postId" value = ${post.data.postId} />
                  <h1 id = "h1">${post.data.title}</h1>
                  <button class= "likes" id="${post.data.postId}">♥︎  ${post.data.likes}</button>
                  
                  <h3>작성자 : ${post.data.User.nickname}</h3>
                  <p>언어 : ${post.data.language}</p>
                  <p>작성 : ${post.data.createdAt}</p>
                  <p>수정 : ${post.data.updatedAt}</p>
                  <p>${post.data.content}</p>
                      <button class = "openmodal${post.data.postId}" id= "${post.data.postId}" >수정</button>
                      <button class="deletepost${post.data.postId}" id= "${post.data.postId}">삭제</button>
                      <div class="modal" id =  "modal${post.data.postId}">
                        <div id="modal-content">
                          <h3>글 수정하기</h3>
                          <label>제목</label>
                          <input type="text" class="title${post.data.postId}" id="${post.data.postId}" />
                          <label>내용</label>
                          <input type="text" class="content${post.data.postId}" id="${post.data.postId}" />
                          <label>언어</label>
                          <input type="text" class="language${post.data.postId}" id="${post.data.postId}" />
                          <button class="close-modal" id= "${post.data.postId}">닫기</button>
                          <button class="edit${post.data.postId}" id= "${post.data.postId}" >수정</button>
                    </div>
                  </div>
                </header>
                 `;
  }

  detailPost.addEventListener('click', ({target}) => {
    const content = document.querySelector(`.content${target.id}`);
    const title = document.querySelector(`.title${target.id}`);
    const language = document.querySelector(`.language${target.id}`);
    if (target.matches(`.openmodal${target.id}`)) {
      const modal = document.querySelector(`#modal${target.id}`);
      content.value = post.data.content;
      language.value = post.data.language;
      title.value = post.data.title;
      modal.style.display = 'block';
    }
    if (target.matches('.close-modal')) {
      const modal = document.querySelector(`#modal${target.id}`);
      modal.style.display = 'none';
    }
    if (target.matches(`.edit${target.id}`)) {
      editpost(target.id, title.value, content.value, language.value);
    }
    if (target.matches(`.deletepost${target.id}`)) {
      deletepost(target.id);
    }
    if (target.matches('.likes')) {
      uplikes(target.id);
    }
  });
}

// 수정하기
async function editpost(postId, title, content, language) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/posts?postId=${postId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content, title, language}),
      },
    );

    const result = await response.json();
    console.log(result.message);
    window.location.reload();
    return alert(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 삭제하기
async function deletepost(postId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/posts?postId=${postId}`,
      {
        method: 'DELETE',
      },
    );
    const result = await response.json();
    console.log(result.message);
    location.href = 'http://localhost:3000/newsfeeds';
    return alert(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 좋아요
async function uplikes(postId) {
  if (localStorage.getItem('liked') == postId.toString()) {
    try {
      const response = await fetch(`http://localhost:3000/api/unlikes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({postId}),
      });
      localStorage.setItem('liked', '0');
      const result = await response.json();
      console.log(result.message);
      location.href = 'http://localhost:3000/detail';
      return alert(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    try {
      const response = await fetch(`http://localhost:3000/api/likes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({postId}),
      });
      localStorage.setItem('liked', postId);
      const result = await response.json();
      console.log(result.message);
      location.href = 'http://localhost:3000/detail';
      return alert(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
