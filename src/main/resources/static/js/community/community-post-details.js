document.addEventListener("DOMContentLoaded", function() {
    // URL에서 게시글 ID 추출 (주소에서 게시글 ID 가져오기)
    const postId = window.location.pathname.split('/').pop();

    // 게시글 상세 정보 fetch
    fetch(`/community/community-details-check/${postId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("게시글을 불러오는 데 실패했습니다.");
            }
        })
        .then(data => {
            if (data) {
                renderPostDetails(data);  // 받은 데이터를 화면에 렌더링
            } else {
                console.error("게시글을 불러오는 데 실패했습니다.");
            }
        })
        .catch(error => console.error("Error fetching post details:", error));
});

// 게시글 상세 정보를 화면에 렌더링하는 함수
function renderPostDetails(post) {
    const postTitle = document.getElementById("post-title");
    const postAuthor = document.getElementById("post-author");
    const postDate = document.getElementById("post-date");
    const postContent = document.getElementById("post-content");

    if (post) {
        postTitle.textContent = post.postTitle;
        postAuthor.textContent = `작성자: ${post.memberId}`;
        postDate.textContent = `작성일: ${post.createdDate}`;
        postContent.textContent = post.postContent;
    } else {
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "게시글을 찾을 수 없습니다.";
        document.body.appendChild(errorMessage);
    }
}
