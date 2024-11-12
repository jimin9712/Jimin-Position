// 회원 관리
// 모든 목록 컨테이너를 가져옴
const MemberListLayout = document.querySelector(".UserTable_container"); // 회원 목록 표시
const MemberListPaging = document.querySelector(".pagination-list.member"); // 페이지네이션 요소
const CorporationListLayout = document.querySelector(".CorporationTable_container"); // 기업 회원 목록 표시
const CorporationPaging = document.querySelector(".pagination-list.corporation"); // 페이지네이션 요소
const memberKeywordInput = document.getElementById("memberSearchInput"); // 검색어 입력 필드
const corporationKeywordInput = document.getElementById("corporationSearchInput"); // 검색어 입력 필드
const sortOptions = document.querySelectorAll(".sort-filter-option"); // 정렬 옵션
let selectedSort = "가입일 순"; // 기본 정렬 설정

// 검색어 초기화
// URL 쿼리 문자열에서 "keyword"라는 이름의 매개변수 값을 가져옴
// 만약 URL에 "keyword" 매개변수가 없다면 기본값으로 빈 문자열("")을 할당함
// URLSearchParams() : 객체 인스턴스를 반환
// window.location.search : 현재 페이지의 쿼리 스트링에 접근하여 현재 페이지 URL의 쿼리 스트링 부분을 가져온다.
memberKeywordInput.value = new URLSearchParams(window.location.search).get("keyword") || "";

// 정렬 옵션 이벤트 설정
sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
        // 선택한 옵션의 data-type 속성을 가져와서 selectedSort에 저장
        selectedSort = option.getAttribute("data-type");

        // 기존 선택 해제하고 새로운 선택 항목에 selected 클래스 추가
        sortOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // 검색어와 정렬 기준을 사용하여 멤버 목록 새로고침
        fetchAndShowMembers(1);
    });
});

// 검색어 입력 시 검색 실행
memberKeywordInput.addEventListener("input", () => {
    fetchAndShowMembers(1);
});

// 페이지 이동 - fetchAndShowMembers 호출
function goToPage(page) {
    fetchAndShowMembers(page);
}

// 일반 회원 목록을 서버에서 가져오고 화면에 표시
const fetchAndShowMembers = async (page) => {
    const keyword = memberKeywordInput.value;
    const sortType = selectedSort;

    try {
        // 데이터를 서버에서 가져오는 요청
        const response = await fetch(`/admin/position/members/${page}?keyword=${keyword}&types=${sortType}`);
        const data = await response.json();

        // 페이지 데이터와 멤버 데이터를 표시하는 함수 호출
        data.pagination.currentPage = page;
        showMemberList(data);
    } catch (error) {
        console.error(`페이지 ${page} 로딩 중 오류 발생:`, error);
    }
};

// 멤버 목록과 페이지네이션을 표시하는 함수
const showMemberList = ( { members, pagination } ) => {
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

    console.log("Total pages:", pagination.totalPages);

    // 페이지 버튼 생성
    let pagingText = '';

    // 처음 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-first ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="pagination-first-link" onclick="goToPage(1)" rel="nofollow">
                <span class="pagination-first-icon" aria-hidden="true">«</span>
            </a>
        </li>
    `;

    // 이전 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-prev ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="pagination-prev-link" onclick="goToPage(${pagination.currentPage - 1})" rel="prev nofollow">
                <span class="pagination-prev-icon" aria-hidden="true">‹</span>
            </a>
        </li>
    `;

    // 페이지 번호 버튼
    for (let i = pagination.startPage; i <= pagination.endPage; i++) {
        pagingText += `
            <li class="pagination-page ${i === pagination.currentPage ? 'active' : ''}">
                <a href="#" class="pagination-page-link" onclick="goToPage(${i})">${i}</a>
            </li>
        `;
    }

    // 다음 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-next ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" class="pagination-next-link" onclick="goToPage(${pagination.currentPage + 1})" rel="next nofollow">
                <span class="pagination-next-icon" aria-hidden="true">›</span>
            </a>
        </li>
    `;

    // 마지막 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-last ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" class="pagination-last-link" onclick="goToPage(${pagination.realEnd})" rel="nofollow">
                <span class="pagination-last-icon" aria-hidden="true">»</span>
            </a>
        </li>
    `;

    // 페이지네이션을 동적으로 추가
    MemberListPaging.innerHTML = pagingText;

};

corporationKeywordInput.value = new URLSearchParams(window.location.search).get("keyword") || "";

// 검색어 입력 시 검색 실행
corporationKeywordInput.addEventListener("input", () => {
    fetchAndShowCorporations(1);
});

// 페이지 이동 - fetchAndShowMembers 호출
function goToCorPage(page) {
    fetchAndShowCorporations(page);
}

// 일반 회원 목록을 서버에서 가져오고 화면에 표시
const fetchAndShowCorporations = async (page) => {
    const keyword = corporationKeywordInput.value;
    try {
        // 데이터를 서버에서 가져오는 요청
        const response = await fetch(`/admin/position/corporation-members/${page}?keyword=${keyword}`);
        const data = await response.json();

        // 페이지 데이터와 멤버 데이터를 표시하는 함수 호출
        data.pagination.currentPage = page;
        showCorporationList(data);
    } catch (error) {
        console.error(`페이지 ${page} 로딩 중 오류 발생:`, error);
    }
};

// 기업 회원 목록과 페이지 처리를 표시
const showCorporationList = ( { corporations, pagination } ) => {
    let text = `
        <div class="CorporationTable_row CorporationTable_header">
            <div class="CorporationTable_cell"><input type="checkbox" class="selectAllCheckbox"/></div>
            <div class="CorporationTable_cell">기업명</div>
            <div class="CorporationTable_cell">가입일</div>
            <div class="CorporationTable_cell">이메일</div>
            <div class="CorporationTable_cell">주소</div>
            <div class="CorporationTable_cell">대표번호</div>
            <div class="CorporationTable_cell">사업자번호</div>
            <div class="CorporationTable_cell">Action</div>
        </div>
    `;

    corporations.forEach((corporation) => {
        text += `
            <div class="CorporationTable_row">
                <div class="CorporationTable_cell"><input type="checkbox" class="CorporationCheckbox"/></div>
                <div class="CorporationTable_cell">${corporation.corporationName || ''}</div>
                <div class="CorporationTable_cell">${corporation.createdDate || ''}</div>
                <div class="CorporationTable_cell">${corporation.corporationEmail || ''}</div>
                <div class="CorporationTable_cell">${corporation.corporationAddress || ''}</div>
                <div class="CorporationTable_cell">${corporation.corporationGen || ''}</div>
                <div class="CorporationTable_cell">${corporation.corporationCode || ''}</div>
                <div class="CorporationTable_cell"><button class="editBtn">수정</button></div>
            </div>    
        `;
    });

    CorporationListLayout.innerHTML = text;

    console.log("Total pages:", pagination.totalPages);

    // 페이지 버튼 생성
    let pagingText = '';

    // 처음 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-first ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="pagination-first-link" onclick="goToCorPage(1)" rel="nofollow">
                <span class="pagination-first-icon" aria-hidden="true">«</span>
            </a>
        </li>
    `;

    // 이전 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-prev ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="pagination-prev-link" onclick="goToCorPage(${pagination.currentPage - 1})" rel="prev nofollow">
                <span class="pagination-prev-icon" aria-hidden="true">‹</span>
            </a>
        </li>
    `;

    // 페이지 번호 버튼
    for (let i = pagination.startPage; i <= pagination.endPage; i++) {
        pagingText += `
            <li class="pagination-page ${i === pagination.currentPage ? 'active' : ''}">
                <a href="#" class="pagination-page-link" onclick="goToCorPage(${i})">${i}</a>
            </li>
        `;
    }

    // 다음 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-next ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" class="pagination-next-link" onclick="goToCorPage(${pagination.currentPage + 1})" rel="next nofollow">
                <span class="pagination-next-icon" aria-hidden="true">›</span>
            </a>
        </li>
    `;

    // 마지막 페이지로 이동하는 버튼
    pagingText += `
        <li class="pagination-last ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
            <a href="#" class="pagination-last-link" onclick="goToCorPage(${pagination.realEnd})" rel="nofollow">
                <span class="pagination-last-icon" aria-hidden="true">»</span>
            </a>
        </li>
    `;

    // 페이징을 동적으로 추가
    CorporationPaging.innerHTML = pagingText;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











