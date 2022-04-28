import Mindmap from "../../utils/mindmap.js";
import shuffle from "lodash/shuffle";
import {toastMessage} from "../../../../global/js/utils/toastMessage";
import {handleHoverStarBtn, handleClickStarBtn} from "../../utils/knowledgeStarAction";


class DiseaseDetail{
    constructor(){        
        //mypage 내가 열어본 페이지에 저장하는 코드
        const address = location.href.match(/knowledges.*/).join();
        const name = document.querySelector('.knowledge_header__name').textContent;
        const date = this.dateFormat(new Date());

        const item = {address : address, name : name, date: date};

        if(localStorage.length > 0){
            const pagehistory = JSON.parse(localStorage.getItem('pageHistory'));

            //연속해서 같은 페이지 기록은 쌓지 않는다.
            if(pagehistory[pagehistory.length-1].name != item.name){
                pagehistory.push(item);
                
                //30개 이상 있을 때 맨 처음 기록 삭제
                while(pagehistory.length > 30){
                    pagehistory.shift();
                }

                localStorage.setItem('pageHistory',JSON.stringify(pagehistory));
            }
        }
        else{
            const pagehistory = [item];
            localStorage.setItem('pageHistory', JSON.stringify(pagehistory));
        }

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
    dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
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
