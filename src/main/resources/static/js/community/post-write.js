// 글자 수 세기 관련 변수
const editor = document.getElementById("qust-detail"); // 글 내용 입력하는 곳
const charCountDisplay = document.querySelector(".post-count em"); // 글자수 표시할 곳

// 글자 수 세기 로직
editor.addEventListener("input", () => {
    const currentLength = editor.textContent.length; // innerText 대신 textContent로 변경
    charCountDisplay.textContent = currentLength; // 글자 수 업데이트
});

// 모달 관련 변수
const submitButton = document.querySelector(".btn-qna-write"); // 게시글 등록 버튼
const modal = document.getElementById("layer-qna-alert"); // 모달창
const modalCloseButton = document.querySelector(".btn-layer-close"); // 모달 닫기 버튼
const confirmButton = document.querySelector(".btn-confirm"); // 확인 버튼
const alertText = document.getElementById("alert-text"); // 모달 내용
const titleInput = document.getElementById("qus-title"); // 제목 입력란
const dimmed = document.getElementById("dimmed"); // dimmed 배경
const postForm = document.getElementById("postForm"); // 폼
const postContentField = document.getElementById("postContent"); // 숨겨진 textarea

// 게시글 제출 버튼 클릭 시
submitButton.addEventListener("click", (event) => {
    event.preventDefault(); // 폼 제출 막기 (유효성 검사 후 진행)

    const title = titleInput.value.trim();
    const content = editor.textContent.trim(); // editor 대신 textContent 사용

    // 제목이 비어있을 때
    if (title === "") {
        alertText.textContent = "앗! 게시글 제목을 입력하고 작성 완료해주세요!";
        modal.style.display = "block";
        dimmed.style.display = "block"; // dimmed 배경 보이기
    }
    // 내용이 비어있을 때
    else if (content === "") {
        alertText.textContent = "앗! 게시글 내용을 입력하고 작성 완료해주세요!";
        modal.style.display = "block";
        dimmed.style.display = "block"; // dimmed 배경 보이기
    }
    // 제목과 내용이 모두 있을 때
    else {
        postContentField.value = content; // 숨겨진 textarea에 값 설정
        postForm.submit(); // 유효성 검사를 통과한 경우 폼 제출
    }
});

// 모달창 닫기 기능 (닫기 버튼)
modalCloseButton.addEventListener("click", () => {
    modal.style.display = "none";
    dimmed.style.display = "none"; // dimmed 배경 숨기기
});

// 모달창 닫기 기능 (확인 버튼 클릭 시)
confirmButton.addEventListener("click", () => {
    modal.style.display = "none";
    dimmed.style.display = "none"; // dimmed 배경 숨기기
});
