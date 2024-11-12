// 데이터 불러오기 및 표시 실행

// 회원관리
// 일반 회원 데이터를 불러와 표시하기 위해 `fetchMembers` 호출
memberService.fetchMembers(1, keywordInput.value, selectedSort, showMemberList);
// 기업 회원 데이터를 불러와 표시하기 위해 `fetchCorporationMembers` 호출
memberService.fetchCorporationMembers(1, keywordInput.value, showCorporationList);

// 지원현황 관리 데이터 불러오기 및 표시 실행
