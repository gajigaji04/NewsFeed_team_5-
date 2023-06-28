document.addEventListener('DOMContentLoaded', commentListing);
async function commentListing() {
  const postId = localStorage.getItem('postId');
  const response = await fetch(
    `http://localhost:3000/api/comments?postId=${postId}`,
  );

  const detailComments = document.querySelector('#detailComments');
  detailComments.innerHTML = `<form action="/api/comments?postId=${postId}" method="POST">
      <h3>댓글 작성하기</h3>
      <div>
          <label>댓글 내용</label>
          <input type="text" name="postContent" />
      </div>
      <button type="submit">작성</button>
    </form>`;

  const allComments = await response.json();
  const commentsList = document.querySelector('.commentsList');
  if (allComments.length == 1 && allComments[0].errorMessage) {
    commentsList.innerHTML = allComments[0].errorMessage;
  } else {
    commentsList.innerHTML = allComments.allComments
      .map(comment => {
        return `<div class = "commentbox">
                  <div>
                      <div>
                        내용 : ${comment.content}
                      </div>
                      <div>
                        작성일 : ${comment.createdAt}
                      </div>
                      <div>
                        수정일 : ${comment.updatedAt}
                      </div>
                  </div>
                  <button class = "openmodal${comment.commentId}" id= "${comment.commentId}" >수정</button>
                  <button class="delete${comment.commentId}" id= "${comment.commentId}">삭제</button>
                  <div class="modal" id =  "modal${comment.commentId}">
                    <div id="modal-content">
                      <h3>댓글 수정하기</h3>
                      <input type="text" class="content${comment.commentId}" id="${comment.commentId}" />
                      <button class="close-modal" id= "${comment.commentId}">닫기</button>
                      <button class="edit${comment.commentId}" id= "${comment.commentId}" >수정하기</button>
                    </div>
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

commentListing();

// 수정하기
async function editcomment(commentId, content) {
  try {
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
    return alert(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 삭제하기
async function deleteComment(commentId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/comments?commentId=${commentId}`,
      {
        method: 'DELETE',
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
