import Secondpage from "./secondpage.js";
import {headerHeight} from '../../global/js/global';
import { shuffle } from "lodash";
import {toastMessage} from "./toastMessage";

class DiseaseDetail{
    constructor(){
        this.setInit();

        // 관련 진단 아이템들 색 랜덤으로 부여하는 코드
        this.colors = [
            '#D8E2DC',
            '#FFE5D9',
            '#FFCAD4',
            '#F4ACB7',
            '#C6B5BA',
        ]
        this.relativeDiagnoses = document.querySelectorAll('.relative_diagnoses__item');
        if(this.relativeDiagnoses){
            this.colorSet();
        }

        // 비로그인 편집 방지하는 코드
        if(document.querySelector('.js-block_to_edit')){
            document.querySelector('.js-block_to_edit')
                .addEventListener("click",this.handleClickEditBtn__toBlockEdit);
        }

        // 마인드맵 그리는 코드
        this.findNode =document.querySelector('.js-knowledge_name').textContent;
        new Secondpage(true, this.findNode);
    }
    setInit(){
        this.diseaseDetailWrap = document.querySelector('.root');
        this.diseaseDetailWrap.style.top = `${headerHeight}px`;
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

window.onload = ()=>{
    new DiseaseDetail();
}
