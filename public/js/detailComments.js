document.addEventListener('DOMContentLoaded', commentListing);
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
  console.log(allComments);
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
                    <button class = "openmodal${comment.commentId}" id= "${comment.commentId}" >수정</button>
                    <button class="delete${comment.commentId}" id= "${comment.commentId}">삭제</button>
                    </div>
                    <div class="modal" id =  "modal${comment.commentId}">
                      <div id="modal-content">
                        <h3>댓글 수정하기</h3>
                        <input type="text" class="content${comment.commentId}" id="commenteditinput" />
                        <button class="close-modal" id= "${comment.commentId}">닫기</button>
                        <button class="edit${comment.commentId}" id= "${comment.commentId}" >수정</button>
                      </div>
                    </div>
             
                 `;
      })
      .join('');
  }

  commentsList.addEventListener('click', ({target}) => {
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
      editcomment(target.id, content);
    }
    if (target.matches(`.delete${target.id}`)) {
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
