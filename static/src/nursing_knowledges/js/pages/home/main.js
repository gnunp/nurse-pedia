import {isMobileDevice} from "../../../../global/js/variables";

class Home{
    constructor(){
        // 모바일 일 경우
        if(isMobileDevice){
        }
        //모바일이 아닌경우
        else{
        }
    }

    //모바일로 들어올때 pc로 들어오라고 안내하기
    mobileSetting(){
        const wrappage = document.querySelector('.wrappage');
        const newdiv = document.createElement('div');
        newdiv.classList.add('mobilewarning');

        newdiv.innerHTML=`
        <div class="logo_mobile">
            <div class="logo_achor" href="{%url 'home' %}">
                <i class="fas fa-heartbeat logo_img_mobile"></i>
                <h1>Nurse Pedia</h1>
            </div>
        </div>
        <h1>모바일 버전은 기다려주세요</br>아직 만들고 있습니다</h1>
        <div style="font-size : 1rem; margin-top:1rem">PC로 방문 부탁드리 겠습니다...</div>
        `;

        wrappage.appendChild(newdiv);
    }
}

window.onload = () => {
    // new Home();
}