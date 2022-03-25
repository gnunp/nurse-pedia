import Mindmap from "./mindmap.js";
import {headerHeight} from '../../global/js/global';
import {toastMessage} from "./toastMessage";
import {handleClickStarBtn, handleHoverStarBtn} from "./knowledge_detail";

class DiagnosisDetail{
    constructor(){
        // 비로그인 편집 방지하는 코드
        if(document.querySelector('.js-block_to_edit')){
            for (const editBtn of document.querySelectorAll('.js-block_to_edit')) {
                editBtn.addEventListener("click",this.handleClickEditBtn__toBlockEdit);
            }
        }

        // 찜하기 버튼 이벤트 관련 코드
        if(document.querySelector('.js-knowledge_star_btn')){
            this.starBtn = document.querySelector('.js-knowledge_star_btn');
            if(!document.querySelector(".js-clicked_star")){
                this.starBtn.addEventListener("mouseover", handleHoverStarBtn);
                this.starBtn.addEventListener("mouseout", handleHoverStarBtn);
            }
            this.starBtn.addEventListener("click", handleClickStarBtn);
        }

        // 마인드맵 그리는 코드
        this.findNode =document.querySelector('.js-knowledge_name').textContent;
        new Mindmap(true, this.findNode);
    }
    handleClickEditBtn__toBlockEdit(event){
        event.preventDefault();
        toastMessage("로그인이 필요합니다");
    }
}

const diagnosisDetailWrap = document.querySelector('.root');
diagnosisDetailWrap.style.top =`${headerHeight}px`;
window.onload = () =>{
    new DiagnosisDetail();
}