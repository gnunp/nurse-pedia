import signInModal from "../../../users/js/html_components/signIn";
import signUpModal from "../../../users/js/html_components/signUp";
/*
전역 변수
*/
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
    const modalTitle = document.querySelector(".modal_header__title");
    // if 현재 띄워져있는 모달이 로그인 모달일 경우
    if(modalTitle.innerText === "로그인"){
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

const showModal = (modalHTML) => {
    // 모달 wrapper 생성
    const modalBackground = document.createElement('div');
    modalBackground.className = "modal_background";
    document.body.appendChild(modalBackground);

    // 가져온 모달 HTML 현재 화면에 넣기
    modalBackground.innerHTML = modalHTML;

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

const userValidation = async (form, fields, url) => {
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
        form.insertAdjacentHTML(
            "beforeend",
            `
            <input type="hidden" name="csrfmiddlewaretoken" value="${getCookie('csrftoken')}">
            `
        )
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



export const userModal = async () => {
    const signInBtn = document.querySelector(".js-sign_in");  // Header - 로그인 버튼
    const signUpBtn = document.querySelector(".js-sign_up");  // Header - 회원가입 버튼
    
    // 이벤트 리스너 등록
    signInBtn.addEventListener("click", handleClickSignInBtn);
    signUpBtn.addEventListener("click", handleClickSignUpBtn);
}

