import Secondpage from "./secondpage.js";
import {headerHeight} from '../../global/js/global';
import {toastMessage} from "./toastMessage";

class DiagnosisDetail{
    constructor(){
        this.setInit();

        // 비로그인 편집 방지하는 코드
        if(document.querySelector('.js-block_to_edit')){
            for (const editBtn of document.querySelectorAll('.js-block_to_edit')) {
                editBtn.addEventListener("click",this.handleClickEditBtn__toBlockEdit);
            }
        }

        this.findNode =document.querySelector('.js-knowledge_name').textContent;
        new Secondpage(true, this.findNode);
    }

    setInit(){
        this.diagnosisDetailWrap = document.querySelector('.root');
        this.diagnosisDetailWrap.style.top =`${headerHeight}px`;
    }

    handleClickEditBtn__toBlockEdit(event){
        event.preventDefault();
        toastMessage("로그인이 필요합니다");
    }
}

window.onload = () =>{
    new DiagnosisDetail();
}