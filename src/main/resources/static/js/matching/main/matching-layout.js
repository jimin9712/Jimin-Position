const noticeLayout = document.getElementById("notice-list");
const noticeTop4Layout = document.getElementById("notice-top-4")

noticeLayout.innerHTML=``;
noticeTop4Layout.innerHTML=``;

const showListScroll = ({notices, pagination}) =>{
    let text=``;

    console.log("pagination.rowCount:", pagination.rowCount);
    console.log("notices.length:", notices.length);
    // 다음 페이지 없을 때,
    if(pagination.rowCount >= notices.length){
        globalThis.loadingFlag = true;
    }else{
        notices.pop();
    }
    notices.forEach((notice) => {
        const fileDTO = notice.fileDTO;
        const logoUrl =`/file/display?fileName=${fileDTO.filePath}/${fileDTO.fileName}`;

        text += `
        <li class="item">
            <a href="" target="-blank" title="${notice.noticeTitle}">
                <span class="logo">
                    <img src="${logoUrl}" alt="${notice.corporationName}">
                </span>
                <strong class="tit">${notice.noticeTitle}</strong>
                <span class="corp">${notice.corporationName}</span>
                <ul class="desc">
                    <li class="company-local ellipsis">${notice.corporationAddress}</li>
                    <li>${notice.noticeCareer}</li>
                    <li>${notice.noticeEducation}
                        <span class="above">이상</span>
                    </li>
                </ul>
                <span class="date">D-2</span>
            </a>
            <button type="button" class="btn-scrap scrap-${notice.id}" title="스크랩">
                <img src="//www.saraminimage.co.kr/common/bul_sri_star.png" alt="스크랩">
            </button>
        </li>
        `;
    });
    noticeLayout.innerHTML += text;
}

let text=``;
top4Notices.notices.forEach((notice) =>{

    const fileDTO = notice.fileDTO;
    const logoUrl =`/file/display?fileName=${fileDTO.filePath}/${fileDTO.fileName}`;

    text+=`
    <li class="item">
            <a href="" target="-blank" title="${notice.noticeTitle}">
                <span class="logo">
                    <img src="${logoUrl}" alt="${notice.corporationName}">
                </span>
                <strong class="tit">${notice.noticeTitle}</strong>
                <span class="corp">${notice.corporationName}</span>
                <ul class="desc">
                    <li class="company-local ellipsis">${notice.corporationAddress}</li>
                    <li>${notice.noticeCareer}</li>
                    <li>${notice.noticeEducation}
                        <span class="above">이상</span>
                    </li>
                </ul>
                <span class="date">D-2</span>
            </a>
            <button type="button" class="btn-scrap scrap-${notice.id}" title="스크랩">
                <img src="//www.saraminimage.co.kr/common/bul_sri_star.png" alt="스크랩">
            </button>
        </li>
    `
})
noticeTop4Layout.innerHTML += text;

// 검색 및 페이지 업데이트 기능 추가
const renderNoticeList = (page = 1, keyword = "", type = "") => {
    matchingService.getList(page, keyword, type, (data) => {
        noticeLayout.innerHTML = ``; // 기존 내용 초기화
        showListScroll(data); // 검색 결과 표시
    });
};

// 검색 버튼 클릭 이벤트 추가
document.getElementById("search-btn").addEventListener("click", () => {
    const keyword = document.getElementById("total-ipt-keyword").value;
    const searchType = getSelectedSearchType(); // 선택된 카테고리 타입 가져오기
    renderNoticeList(1, keyword, searchType);
});

const getSelectedSearchType = () => {
    const button = document.querySelector(".btn-three-depth.on");
    return button ? button.getAttribute("data-categorya") : ""; // 선택된 카테고리 값 반환
};
