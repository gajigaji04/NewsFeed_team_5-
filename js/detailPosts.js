document.addEventListener('DOMContentLoaded', postListing);
async function postListing() {
  const pagetitle = document.querySelector('#pagetitle');
  const detailPost = document.querySelector('#detailPost');
  localStorage.setItem('postId', '1'); //나중에 뉴스피드에서 게시글 클릭시로 바꿀 예정
  const postId = localStorage.getItem('postId');
  const response = await fetch(
    `http://localhost:3000/api/posts?postId=${postId}`,
  );
  const post = await response.json();
  pagetitle.innerHTML = `${post.data.title}`;
  if (!post) {
    detailPost.innerHTML = post.message;
  } else {
    detailPost.innerHTML = `
    <header>
    <input type="hidden" id="postId" value = ${post.data.postId} />
                  <h1 id = "h1">${post.data.title}</h1>
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
    if (target.matches(`.openmodal${target.id}`)) {
      const modal = document.querySelector(`#modal${target.id}`);
      modal.style.display = 'block';
    }
    if (target.matches('.close-modal')) {
      const modal = document.querySelector(`#modal${target.id}`);
      modal.style.display = 'none';
    }
    if (target.matches(`.edit${target.id}`)) {
      const content = document.querySelector(`.content${target.id}`).value;
      const title = document.querySelector(`.title${target.id}`).value;
      const language = document.querySelector(`.language${target.id}`).value;
      editpost(target.id, title, content, language);
    }
    if (target.matches(`.deletepost${target.id}`)) {
      deletepost(target.id);
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
    console.log(result.data);
    window.location.reload();
    return alert(result.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
