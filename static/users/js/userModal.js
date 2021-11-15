const signInBtn = document.querySelector(".js-sign_in");  // Header - 로그인 버튼
const signUpBtn = document.querySelector(".js-sign_up");  // Header - 회원가입 버튼

// 로그인 모달창을 띄우는 함수
const handleClickSignInBtn = async (event) => {
    alert("로그인");

    // 모달 wrapper 생성
    const modalWrapper = document.createElement('div');
    modalWrapper.className = "user_modal_wrapper";
    document.body.appendChild(modalWrapper);
    
    // 모달 HTML text로 가져오기
    const response = await fetch('/users/signin-modal');
    const signInModalHtml = await response.text();

    // DOM Parser 생성
    const parser = new DOMParser();

    // 모달 DOM으로 변환
    const signInModalDocument = parser.parseFromString(signInModalHtml, "text/html");

    
}

// 회원가입 모달창을 띄우는 함수
const handleClicksignUpBtn = (event) => {
    alert("회원가입")
}


/*
이벤트 리스너
*/
signInBtn.addEventListener("click", handleClickSignInBtn);
signUpBtn.addEventListener("click", handleClicksignUpBtn);