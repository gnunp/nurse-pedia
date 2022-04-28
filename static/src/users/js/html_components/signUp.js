const signUpModal = `
    <div class="modal_wrapper">
        <!-- 모달 HEADER -->
        <div class="modal__header">
            <div class=""></div>
            <span class="modal_header__title">회원가입</span>
            <i class="fas fa-times modal_header__close_btn js-modal_close_btn"></i>
        </div>

        <!-- 모달 CONTENT -->
        <div class="modal__content">
            <form action="/users/signin-action" method="post" class="modal__content__form js-user_form">
                    <div class="input_wrapper">
                        <input type="text" name="username" placeholder="아이디" required maxlength="150" id="id_username">
                        
                    </div>
                
                    <div class="input_wrapper">
                        <input type="email" name="email" placeholder="이메일(선택)" maxlength="254" id="id_email">
                        
                    </div>
                
                    <div class="input_wrapper">
                        <input type="password" name="current_password" placeholder="비밀번호" required autocomplete="current-password" id="id_current_password">
                        
                    </div>
                
                    <div class="input_wrapper">
                        <input type="password" name="confirm_password" placeholder="비밀번호 확인" required autocomplete="confirm-password" id="id_confirm_password">
                        
                    </div>
                
                <button class="form__submit_btn js-submit_btn">
                    <span>회원가입</span>
                </button>
            </form>
            <div class="modal__content__or_line">
                <hr>
                <span>또는</span>
            </div>
            <a href="/users/signin/kakao" class="modal__content__kakao_login_btn">
                <i class="fas fa-comment"></i>
                <span>카카오계정 로그인</span>
            </a>
            <div class="modal__content__toggle">
                <span>이미 계정을 보유하고 계신가요?</span>
                <span class="modal__content__toggle__btn js-toggle_btn">로그인</a>
            </div>
        </div>
    </div>
`

export default signUpModal;