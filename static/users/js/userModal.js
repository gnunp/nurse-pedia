const signInBtn = document.querySelector(".js-sign_in");  // Header - 로그인 버튼
const signUpBtn = document.querySelector(".js-sign_up");  // Header - 회원가입 버튼

// 로그인 모달창을 띄우는 함수
const handleClickSignInBtn = async (event) => {
    // 모달 wrapper 생성
    const modalWrapper = document.createElement('div');
    modalWrapper.className = "user_modal_wrapper";
    document.body.appendChild(modalWrapper);
    
    // 로그인 모달 HTML text로 가져오기
    const response = await fetch('/users/signin-modal');
    const signInModalHtml = await response.text();

    // DOM Parser 생성
    const parser = new DOMParser();

    // 로그인 모달 DOM으로 변환
    const signInModalDocument = parser.parseFromString(signInModalHtml, "text/html");

    // 가져온 로그인 모달 HTML 현재 화면에 넣기
    const signInModalWrapper = signInModalDocument.querySelector(".modal__signin_wrapper")
    modalWrapper.appendChild(signInModalWrapper);

    // 모달 닫기 이벤트 리스너 추가
    const signInModalCloseBtn = document.querySelector(".js-signin_close_btn");
    signInModalCloseBtn.addEventListener("click", handleClickModalCloseBtn)
}

// 회원가입 모달창을 띄우는 함수
const handleClicksignUpBtn = (event) => {
    alert("회원가입")
}

// 모달창을 닫는 함수
const handleClickModalCloseBtn = (event) => {
    document.querySelector(".user_modal_wrapper").remove();
}


/*
이벤트 리스너
*/
signInBtn.addEventListener("click", handleClickSignInBtn);
signUpBtn.addEventListener("click", handleClicksignUpBtn);