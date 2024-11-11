document.addEventListener("DOMContentLoaded", function() {
    // 페이지 로딩 시 기본적으로 최신순으로 게시글을 불러옴
    fetchPosts(1, '', '최신순');  // 기본적으로 "최신순" 필터를 사용하여 페이지 로드

    // 체크박스에 이벤트 리스너 추가 (한 번에 하나만 선택)
    const checkboxes = document.querySelectorAll(".btn-sort");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function() {
            // 다른 체크박스를 모두 해제
            checkboxes.forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            // 선택된 필터를 기준으로 게시글을 새로 고침
            let selectedFilter = getSelectedFilters();
            fetchPosts(1, '', selectedFilter); // 페이지 1로 요청, 검색어와 필터를 함께 전달
        });
    });

    // 검색 버튼 클릭 이벤트 처리
    document.getElementById('search-button').addEventListener('click', function() {
        const searchQuery = document.getElementById('input-keyword').value.trim();
        if (searchQuery === "") {
            alert("검색어를 입력해주세요.");
            return;
        }
        let selectedFilter = getSelectedFilters(); // 선택된 필터값을 가져옴
        fetchPosts(1, searchQuery, selectedFilter);  // 페이지 1로 요청, 검색어와 필터 전달
    });
});

// 체크박스에서 선택된 필터 값을 하나만 반환하는 함수
function getSelectedFilters() {
    let selectedFilter = '최신순';  // 기본적으로 최신순으로 설정
    const checkboxes = document.querySelectorAll(".btn-sort");

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedFilter = checkbox.value; // 체크된 값 하나만 반환
        }
    });

    return selectedFilter;  // 필터가 없으면 기본값 '최신순'이 반환됨
}

// 게시글을 렌더링하는 함수
function renderPosts(data) {
    const posts = data.posts;
    const pagination = data.pagination;
    const totalCount = data.total;  // 전체 게시글 수 받아오기
    const postList = document.getElementById("qst-and-ans-list");
    postList.innerHTML = ""; // 기존 항목 초기화하여 중복 추가 방지

    const listNumTitle = document.querySelector(".list-num-tit strong");
    listNumTitle.textContent = totalCount.toLocaleString();

    if (posts.length === 0) {
        const noPostsMessage = document.createElement('li');
        noPostsMessage.innerText = "게시글이 없습니다.";
        postList.appendChild(noPostsMessage);
    } else {
        posts.forEach((post) => {
            const listItem = document.createElement("li");

            const hotLabel = post.postReadCount && post.postReadCount > 100 ? `<em class="label hot">HOT</em>` : "";

            listItem.innerHTML = `
                <div class="qna-subject-wrap">
                    ${hotLabel}
                    <span class="qna-subject">${post.postTitle}</span>
                </div>
                <span class="qna-desc">${post.postContent}</span>
                <div class="qna-data-infos">
                    <span class="qna-info qna-reply">댓글 <strong>0</strong></span>
                    <span class="qna-info qna-view">조회 <strong>${post.postReadCount || 0}</strong></span>
                    <div class="qna-member-info">
                        <span class="qna-from">회원 ID ${post.memberId}님이 ${post.createdDate}</span>
                    </div>
                </div>
            `;

            listItem.addEventListener("click", () => {
                window.location.href = `/community/community-details/${post.id}`;
            });

            postList.appendChild(listItem);
        });
    }

    renderPagination(pagination); // 페이지네이션 생성
}

// 페이지네이션 렌더링 함수
function renderPagination(pagination) {
    const paginationElement = document.getElementById("page-box");
    paginationElement.innerHTML = ""; // 기존 페이지네이션 초기화

    // 데이터가 없으면 페이지네이션을 렌더링하지 않음
    if (pagination.total === 0) {
        return;
    }

    // `realEnd` 값 계산 (페이지네이션 끝값 계산)
    pagination.realEnd = Math.ceil(pagination.total / pagination.rowCount);

    // 이전 버튼
    if (pagination.prev) {
        const prevButton = document.createElement("a");
        prevButton.textContent = "이전";
        prevButton.href = `#`;
        prevButton.classList.add("btn-type", "size-s");
        prevButton.onclick = (event) => {
            event.preventDefault();
            fetchPosts(pagination.page - 1);
        };
        paginationElement.appendChild(prevButton);
    }

    // 필요한 페이지 버튼만 렌더링 (페이지 수가 많으면 페이지 버튼을 제한)
    for (let i = pagination.startPage; i <= pagination.realEnd && i <= pagination.endPage; i++) {
        const pageButton = document.createElement("a");
        pageButton.classList.add("btn-type", "size-s");
        pageButton.textContent = i;
        if (i === pagination.page) {
            pageButton.classList.add("active");
        }
        pageButton.onclick = (event) => {
            event.preventDefault();
            fetchPosts(i);
        };
        paginationElement.appendChild(pageButton);
    }

    // 다음 버튼
    if (pagination.next) {
        const nextButton = document.createElement("a");
        nextButton.classList.add("btn-type", "size-s", "btn-next");
        nextButton.textContent = "다음";
        nextButton.href = `#`;
        nextButton.onclick = (event) => {
            event.preventDefault();
            fetchPosts(pagination.page + 1);
        };
        paginationElement.appendChild(nextButton);
    }
}

// 서버에서 게시글과 페이징 정보 불러오기
function fetchPosts(page = 1, searchQuery = '', selectedFilter = '최신순') {
    const url = `/community/community-post-list-check?page=${page}&search=${encodeURIComponent(searchQuery)}&filterType=${encodeURIComponent(selectedFilter)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.posts && data.pagination) {
                renderPosts(data);
            } else {
                console.error("Invalid response structure:", data);
            }
        })
        .catch(error => console.error("Error fetching posts:", error));
}
