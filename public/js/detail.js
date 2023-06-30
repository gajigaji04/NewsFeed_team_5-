document.addEventListener('DOMContentLoaded', postListing);
document.addEventListener('DOMContentLoaded', commentListing);
async function postListing() {
  const pagetitle = document.querySelector('#pagetitle');
  const detailPost = document.querySelector('#detailPost');
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
                        <form action="/api/posts/${post.data.postId}?_method=PATCH" method="POST">
                          <h3>글 수정하기</h3>
                          <div>
                          <label>제목</label>
                          <input name="title"  class= "title${post.data.postId}" id= "${post.data.postId}" />
                          </div>
                          <div>
                          <label>언어</label>
                          <input name="language"  class= "language${post.data.postId}" id= "${post.data.postId}" />
                          </div>
                          <div>
                          <label>내용</label>
                          <textarea name="content" class ="editor" id= "editor${post.data.postId}">${post.data.content}</textarea>
                          </div>
                          </br>
                          <button type="submit" id ="edit${post.data.postId}">수정</button>
                          </form>
                          </br>
                          <button class="close-modal" id= "${post.data.postId}">닫기</button>
                         
                    </div>
                  </div>
                </header>
                 `;
  }

  detailPost.addEventListener('click', ({target}) => {
    const title = document.querySelector(`.title${target.id}`);
    const language = document.querySelector(`.language${target.id}`);
    if (target.matches(`.openmodal${target.id}`)) {
      const modal = document.querySelector(`#modal${target.id}`);
      language.value = post.data.language;
      title.value = post.data.title;
      modal.style.display = 'block';
    }
    if (target.matches('.close-modal')) {
      const modal = document.querySelector(`#modal${target.id}`);
      modal.style.display = 'none';
    }
    if (target.matches(`.deletepost${target.id}`)) {
      deletepost(target.id);
    }
    if (target.matches('.likes')) {
      uplikes(target.id);
    }
  });
}

function editorload() {
  setTimeout(
    () =>
      ClassicEditor.create(document.querySelector('.editor'), {
        licenseKey: '',
      })
        .then(editor => {
          window.editor = editor;
        })
        .catch(error => {
          console.error('Oops, something went wrong!');
          console.error(
            'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:',
          );
          console.warn('Build id: m5b6f09wom88-nohdljl880ze');
          console.error(error);
        }),
    1000,
  );
}

editorload();

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

// 댓글
async function commentListing() {
  const postId = localStorage.getItem('postId');
  const response = await fetch(
    `http://localhost:3000/api/comments?postId=${postId}`,
  );

  const detailComments = document.querySelector('#detailComments');
  detailComments.innerHTML = `
  <main>
  <form id = "writtingcomment" action="/api/comments?postId=${postId}" method="POST">
      <h3>댓글 작성하기</h3>
      <div>
          <input type="text" name="postContent" id= "commentinput" />
      </div>
      <button type="submit">작성</button>
    </form>
    </main>
    `;

  const allComments = await response.json();
  const commentsList = document.querySelector('.commentsList');
  if (allComments.length == 1 && allComments[0].errorMessage) {
    commentsList.innerHTML = allComments[0].errorMessage;
  } else {
    commentsList.innerHTML = allComments.allComments
      .map(comment => {
        return `<div class = "bigcommentbox">
                    <div class = "commentbox">
                        <div class = "innercommentbox" id ="commentcontent">
                          내용 : ${comment.content}
                        </div>
                        <div class = "innercommentbox" id ="commentnickname">
                          닉네임 : ${comment.User.nickname}
                        </div>
                        <div class = "innercommentbox" id ="commentwritedate">
                          작성일 : ${comment.createdAt}
                        </div>
                        <div class = "innercommentbox" id ="commenteditdate">
                          수정일 : ${comment.updatedAt}
                        </div>
                    </div>
                    <button class = "openmodalcomment${comment.commentId}" id= "${comment.commentId}" >수정</button>
                    <button class="deletecomment${comment.commentId}" id= "${comment.commentId}">삭제</button>
                    </div>
                    <div class="modal" id =  "modal2${comment.commentId}">
                      <div id="modal-content">
                        <h3>댓글 수정하기</h3>
                        <textarea type="text" class="content2${comment.commentId}" id="commenteditinput" >${comment.content}</textarea>
                        <button class="close-modal2" id= "${comment.commentId}">닫기</button>
                        <button class="editcomment${comment.commentId}" id= "${comment.commentId}" >수정</button>
                      </div>
                    </div>
             
                 `;
      })
      .join('');
  }

  commentsList.addEventListener('click', ({target}) => {
    if (target.matches(`.openmodalcomment${target.id}`)) {
      const modal2 = document.querySelector(`#modal2${target.id}`);
      modal2.style.display = 'block';
    }
    if (target.matches('.close-modal2')) {
      const modal2 = document.querySelector(`#modal2${target.id}`);
      modal2.style.display = 'none';
    }
    if (target.matches(`.editcomment${target.id}`)) {
      const content = document.querySelector(`.content2${target.id}`).value;
      editcomment(target.id, content);
    }
    if (target.matches(`.deletecomment${target.id}`)) {
      deleteComment(target.id);
    }
  });
}

// 수정하기
async function editcomment(commentId, content) {
  const response = await fetch(
    `http://localhost:3000/api/comments?commentId=${commentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content}),
    },
  );
  const result = await response.json();
  console.log(result.message);
  window.location.reload();
  alert(result.message);
  return;
}

// 삭제하기
async function deleteComment(commentId) {
  const response = await fetch(
    `http://localhost:3000/api/comments?commentId=${commentId}`,
    {
      method: 'DELETE',
    },
  );
  const result = await response.json();
  console.log(result.message);
  window.location.reload();
  alert(result.message);
  return;
}

function locationwhere() {
  location.href = 'http://localhost:3000/newsfeeds';
}
