/*
전역 변수
*/
let signInModal; // 로그인 모달 Element
let signUpModal; // 회원가입 모달 Element


const showModal = (modalElement) => {
    // 모달 wrapper 생성
    const modalBackground = document.createElement('div');
    modalBackground.className = "modal_background";
    document.body.appendChild(modalBackground);

    // 가져온 모달 HTML 현재 화면에 넣기
    modalBackground.appendChild(modalElement);

    // 모달 닫기 이벤트 리스너 추가
    const modalCloseBtn = document.querySelector(".js-modal_close_btn");
    modalCloseBtn.addEventListener("click", handleClickModalCloseBtn)
}

const handleClickModalCloseBtn = (event) => {
    document.querySelector(".modal_background").remove();
}

const handleClickSignInBtn = (event) => {
    showModal(signInModal);
}

const handleClickSignUpBtn = (event) => {
    alert("회원가입")
}



const userModalInit = async () => {
    const signInBtn = document.querySelector(".js-sign_in");  // Header - 로그인 버튼
    const signUpBtn = document.querySelector(".js-sign_up");  // Header - 회원가입 버튼
    
    // 이벤트 리스너 등록
    signInBtn.addEventListener("click", handleClickSignInBtn);
    signUpBtn.addEventListener("click", handleClickSignUpBtn);


    // 모달 HTML text로 가져오기
    const SignInModalResponse = await fetch('/users/signin-modal');
    const signInModalHtml = await SignInModalResponse.text();

    // DOM Parser 생성
    const parser = new DOMParser();

    // 모달 DOM으로 변환
    signInDocument = parser.parseFromString(signInModalHtml, "text/html");

    // 모달 Element
    signInModal = signInDocument.querySelector(".modal_wrapper");

}

userModalInit();

