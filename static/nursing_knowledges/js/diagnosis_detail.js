import Mindmap from "./mindmap.js";
import {headerHeight} from "../../global/js/variables";
import {toastMessage} from "./toastMessage";
import {handleClickStarBtn, handleHoverStarBtn} from "./knowledge_detail";

class DiagnosisDetail{
    constructor(){
        //mypage 내가 열어본 페이지에 저장하는 코드
        const address = location.href.match(/knowledges.*/).join();
        const name = document.querySelector('.knowledge_header__name').textContent;
        const item = {address : address, name : name};

        if(localStorage.length > 0){
            const pagehistory = JSON.parse(localStorage.getItem('pageHistory'));

            if(pagehistory[pagehistory.length-1].name != item.name){
                pagehistory.push(item);
                localStorage.setItem('pageHistory',JSON.stringify(pagehistory));
            }
        }
        else{
            const pagehistory = [item];
            localStorage.setItem('pageHistory', JSON.stringify(pagehistory));
        }
        
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