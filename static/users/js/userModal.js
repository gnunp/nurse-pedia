/*
전역 변수
*/
let signInModal; // 로그인 모달 Element
let signUpModal; // 회원가입 모달 Element
const parser = new DOMParser(); // DOM Parser 생성
let validationErrorNodes = [];
let url;
let fields;

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
        url = "/users/signup";
    }
    // else 회원가입 모달일 경우
    else{
        deleteModal();
        showModal(signInModal);
        url = "/users/signin";
    }

    fields = {};
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

    // 폼 제출 이벤트 리스너 추가
    const userForm = document.querySelector(".js-user_form");
    userForm.addEventListener("submit", handleUserFormSubmit);
}

export const userValidation = async (form, fields, url) => {
    // 기존의 모든 에러 제거
    for (const errorElement of validationErrorNodes) {
        errorElement.remove();
    }
    validationErrorNodes = []  // 에러 리스트 초기화


    // 보낼 폼 데이터 생성
    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    for (const [field, element] of Object.entries(fields)) {
        formData.append(field, element.value);
    }

    // 유효성 검사 Response 받아오기
    const userValidationResponse = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    // if 유효성 검사에 성공했다면 then 로그인 처리
    if(userValidationResponse.status == 200){
        form.querySelector("input[type=hidden]").value = getCookie('csrftoken'); // csrf 새로 갱신

        form.submit();  // 로그인
    // else 유효성 검사에 실패했다면 then 폼 validation error HTML코드로 추가
    }else{
        const userValidationJson = await userValidationResponse.json();
        // alert("status code :400, 유저 Validation 실패");
        
        for (const [field, errors] of Object.entries(userValidationJson)) {

            // 에러 HTML에 추가
            const fieldInput = form.querySelector(`#id_${field}`);
            for (const error of errors) {
                const errorElement = document.createElement("span");
                errorElement.className = "error";
                errorElement.innerText = error;
                
                fieldInput.parentNode.appendChild(errorElement);  // INPUT 밑에 error element 추가

                validationErrorNodes.push(errorElement);  // 에러 리스트에 추가
            }
        }

    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

const handleUserFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    fields = {};

    const username = document.querySelector("#id_username");
    fields['username'] = username;


    if(document.querySelector("#id_email")){
        const email = document.querySelector("#id_email");
        fields['email'] = email;
    }

    const currentPassword = document.querySelector("#id_current_password");
    fields['current_password'] = currentPassword;

    if(document.querySelector("#id_confirm_password")){
        const confirmPassword = document.querySelector("#id_confirm_password");
        fields['confirm_password'] = confirmPassword;
    }

    userValidation(form, fields, url);
}

const handleClickSignInBtn = (event) => {
    showModal(signInModal);

    url = "/users/signin";
}

const handleClickSignUpBtn = (event) => {
    showModal(signUpModal);

    url = "/users/signup";
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
    const signInDocument = parser.parseFromString(signInModalHtml, "text/html");
    const signUpDocument = parser.parseFromString(signUpModalHtml, "text/html");

    // 모달 Element
    signInModal = signInDocument.querySelector(".modal_wrapper");
    signUpModal = signUpDocument.querySelector(".modal_wrapper");

}

userModalInit();

