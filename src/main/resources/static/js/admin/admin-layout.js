// DOM 요소 가져오기
const MemberListLayout = document.querySelector(".UserTable_container"); // 멤버 목록이 표시될 실제 컨테이너
const MemberListPaging = document.querySelector(".pagination-list"); // 페이지네이션 요소
const keywordInput = document.querySelector(".Filter_searchInput"); // 검색어 입력 필드
const sortOptions = document.querySelectorAll(".sort-filter-option"); // 정렬 옵션
let selectedSort = "가입일 순"; // 기본 정렬 설정

// 검색어 초기화
keywordInput.value = new URLSearchParams(window.location.search).get("keyword") || "";

// 정렬 옵션 이벤트 설정
sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
        // 정렬 기준 업데이트
        selectedSort = option.textContent;
        sortOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // 검색어와 정렬 기준을 사용하여 멤버 목록 새로고침
        fetchAndShowMembers(1);
    });
});

// 검색어 입력 시 검색 실행
keywordInput.addEventListener("input", () => {
    fetchAndShowMembers(1);
});

// 페이지 이동 함수
function goToPage(page) {
    fetchAndShowMembers(page);
}

// 멤버 목록을 서버에서 가져오고 화면에 표시하는 함수
const fetchAndShowMembers = (page) => {
    const keyword = keywordInput.value;
    memberService.fetchMembers(page, keyword, selectedSort, showMemberList);
};

// 멤버 목록과 페이지네이션을 표시하는 함수
const showMemberList = ( members, pagination ) => {
    let text = `
        <div class="UserTable_row UserTable_header">
            <div class="UserTable_cell"><input type="checkbox" class="selectAllCheckbox"/></div>
            <div class="UserTable_cell">이름</div>
            <div class="UserTable_cell">가입일</div>
            <div class="UserTable_cell">이메일</div>
            <div class="UserTable_cell">주소</div>
            <div class="UserTable_cell">전화번호</div>
            <div class="UserTable_cell">상태</div>
            <div class="UserTable_cell">Action</div>
        </div>
    `;

    members.forEach((member) => {
        text += `
            <div class="UserTable_row">
                <div class="UserTable_cell"><input type="checkbox" class="userCheckbox"/></div>
                <div class="UserTable_cell">${member.memberName || ''}</div>
                <div class="UserTable_cell">${member.createdDate || ''}</div>
                <div class="UserTable_cell">${member.memberEmail || ''}</div>
                <div class="UserTable_cell">${member.memberAddress || ''}</div>
                <div class="UserTable_cell">${member.memberPhone || ''}</div>
                <div class="UserTable_cell">${member.memberStatus || ''}</div>
                <div class="UserTable_cell"><button class="editBtn">수정</button></div>
            </div>    
        `;
    });

    MemberListLayout.innerHTML = text;
    setupPagination(pagination);
};

// 페이지네이션 설정 함수
const setupPagination = (pagination) => {
    let pagingText = '';

    pagingText += `
        <li class="pagination-first ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" onclick="fetchAndShowMembers(1)">«</a>
        </li>
        <li class="pagination-prev ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" onclick="fetchAndShowMembers(${pagination.currentPage - 1})">‹</a>
        </li>
    `;

    for (let i = pagination.startPage; i <= pagination.endPage; i++) {
        pagingText += `
            <li class="pagination-page ${i === pagination.currentPage ? 'active' : ''}">
                <a href="#" onclick="fetchAndShowMembers(${i})">${i}</a>
            </li>
        `;
    }

    pagingText += `
        <li class="pagination-next ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" onclick="fetchAndShowMembers(${pagination.currentPage + 1})">›</a>
        </li>
        <li class="pagination-last ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" onclick="fetchAndShowMembers(${pagination.totalPages})">»</a>
        </li>
    `;

    MemberListPaging.innerHTML = pagingText;
};







