import Mindmap from "./mindmap.js";
import {headerHeight} from '../../global/js/global';
import shuffle from "lodash/shuffle";
import {toastMessage} from "./toastMessage";
import {handleHoverStarBtn, handleClickStarBtn} from "./knowledge_detail";

class DiseaseDetail{
    constructor(){
        // 관련 진단 아이템들 색 랜덤으로 부여하는 코드
        this.colors = [
            '#D8E2DC',
            '#FFE5D9',
            '#FFCAD4',
            '#F4ACB7',
            '#C6B5BA',
        ]
        this.relativeDiagnoses = document.querySelectorAll('.js-relative_diagnosis_item');
        if(this.relativeDiagnoses){
            this.colorSet();
        }

        // 비로그인 편집 방지하는 코드
        if(document.querySelector('.js-block_to_edit')){
            document.querySelector('.js-block_to_edit')
                .addEventListener("click",this.handleClickEditBtn__toBlockEdit);
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

    colorSet(){
        this.relativeDiagnoses.forEach((diagnosis, index) => {
            if(index % this.colors.length === 0){
                this.colors = shuffle(this.colors);
            }
            diagnosis.style.backgroundColor=this.colors[index % this.colors.length];
        });
    }

    handleClickEditBtn__toBlockEdit(event){
        event.preventDefault();
        toastMessage("로그인이 필요합니다");
    }
}

const diseaseDetailWrap = document.querySelector('.root');
diseaseDetailWrap.style.top = `${headerHeight}px`;

window.onload = ()=>{
    new DiseaseDetail();
}
