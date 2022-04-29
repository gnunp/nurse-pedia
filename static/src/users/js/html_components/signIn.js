const signInModal = `
    <div class="modal_wrapper">
        <!-- 모달 HEADER -->
        <div class="modal__header">
            <span class="modal_header__title">로그인</span>
            <i class="fas fa-times modal_header__close_btn js-modal_close_btn"></i>
        </div>

        <!-- 모달 CONTENT -->
        <div class="modal__content">
            <form action="/users/signin-action" method="post" class="modal__content__form js-user_form">
                    <div class="input_wrapper">
                        <input type="text" name="username" placeholder="아이디" required autocomplete="username" maxlength="150" id="id_username">
                        
                    </div>
                
                    <div class="input_wrapper">
                        <input type="password" name="current_password" placeholder="비밀번호" required autocomplete="current-password" id="id_current_password">
                        
                    </div>
                
                <button type="submit" class="form__submit_btn js-submit_btn">
                    <span>로그인</span>
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
                <span>계정이 없으신가요?</span>
                <span class="modal__content__toggle__btn js-toggle_btn">회원가입</a>
            </div>
        </div>
    </div>
`

export default signInModal