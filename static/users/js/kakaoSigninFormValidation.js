import "regenerator-runtime/runtime.js";


/*
전역 변수
*/
let validationErrorNodes = [];
const url = "/users/signin/kakao/validation"



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
    const fields = {};

    const username = document.querySelector("#id_username");
    fields['username'] = username;

    fields['kakao_id'] = { value: kakaoIdVariable };


    if(emailVariable){
        fields['email'] = { value: emailVariable };
    }
    else{
        const email = document.querySelector("#id_email");
        fields['email'] = email;
    }

    userValidation(form, fields, url);
}


const userForm = document.querySelector(".js-user_form");
userForm.addEventListener("submit", handleUserFormSubmit);


