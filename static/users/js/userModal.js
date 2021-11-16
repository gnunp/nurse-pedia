/*
전역 변수
*/
let signInModal; // 로그인 모달 Element
let signUpModal; // 회원가입 모달 Element
const parser = new DOMParser(); // DOM Parser 생성

const deleteModal = () => {
    document.querySelector(".modal_background").remove();
}

const handleClickModalCloseBtn = (event) => {
    deleteModal();
}

const modalToggle = () => {
    const currentModal = document.querySelector(".modal_wrapper");
    // if 현재 띄워져있는 모달이 로그인 모달일 경우
    if(Object.is(currentModal, signInModal)){
        deleteModal();
        showModal(signUpModal);
    }
    // else 회원가입 모달일 경우
    else{
        deleteModal();
        showModal(signInModal);
    }
}

const handleClickModalToggleBtn = (event) => {
    modalToggle();
}

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

    // 모달 토글 이벤트 리스너 추가
    const modalToggleBtn = document.querySelector(".js-toggle_btn");
    modalToggleBtn.addEventListener("click", handleClickModalToggleBtn);
}

const getUserValidation = async () => {
    const username = document.querySelector("#id_username");
    const currentPassword = document.querySelector("#id_current_password");

    // 보낼 폼 데이터 생성
    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrfToken);
    formData.append('username', username.value);
    formData.append('current_password', currentPassword.value);

    const userValidationResponse = await fetch('/users/signin', {
        method: 'POST',
        body: formData,
    });
    console.log(userValidationResponse);
    if(userValidationResponse.status == 200){
        alert("status code :200, 유저 Validation 성공");
        // 로그인으로 이동
    }else{
        // form validation error HTML코드로 추가
        const userValidationJson = await userValidationResponse.json();
        alert("status code :400, 유저 Validation 실패");
        console.log(userValidationJson);

        for (const field of userValidationJson) {
            cdonsole.log(field);
        }
    }
}

const handleUserFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    getUserValidation();

    // form.submit();
}

const handleClickSignInBtn = (event) => {
    showModal(signInModal);

    // 폼 제출 이벤트 리스너 추가
    const userForm = document.querySelector(".js-user_form");
    userForm.addEventListener("submit", handleUserFormSubmit);
}

const handleClickSignUpBtn = (event) => {
    showModal(signUpModal);
}



const userModalInit = async () => {
    const signInBtn = document.querySelector(".js-sign_in");  // Header - 로그인 버튼
    const signUpBtn = document.querySelector(".js-sign_up");  // Header - 회원가입 버튼
    
    // 이벤트 리스너 등록
    signInBtn.addEventListener("click", handleClickSignInBtn);
    signUpBtn.addEventListener("click", handleClickSignUpBtn);


    // 모달 HTML text로 가져오기
    const signInModalResponse = await fetch('/users/signin');
    const signInModalHtml = await signInModalResponse.text();

    const signUpModalResponse = await fetch('/users/signup');
    const signUpModalHtml = await signUpModalResponse.text();

    // 모달 DOM으로 변환
    signInDocument = parser.parseFromString(signInModalHtml, "text/html");
    signUpDocument = parser.parseFromString(signUpModalHtml, "text/html");

    // 모달 Element
    signInModal = signInDocument.querySelector(".modal_wrapper");
    signUpModal = signUpDocument.querySelector(".modal_wrapper");

}

userModalInit();

