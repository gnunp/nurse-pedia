import '../css/disease_category.css';

import {animation} from '../../global/js/animation';
import {headerHeight} from "../../global/js/variables";

class DiseaseCategory{
    constructor(){
        this.mainContent = document.querySelector('.dis_cat_mainContent');
        this.largedisease = knowledgeData.large_diseases;
        this.spreadspeed = 0.1;

        this.setInitStyle();
        this.createCategoryElement();
    }
    setInitStyle(){
        /*--------------Header높이 만큼 위에서 떨어트림--------------- */
        this.mainContent.style.top = `${headerHeight}px`;
    }
    createBtn(child_ele, parents_ele, type){
        const newbtn = document.createElement('button');
        newbtn.innerText = "◀";

        /*--------------------버튼 클릭시 발생되는 이벤트 ---------------- */
        newbtn.addEventListener('click',(e)=>{
            /*-----------------처음 Height값 저장(첫번째 클릭에만 실행) -------------- */
            if(parents_ele.dataset.issetmaxheight == 'true'){
               animation.setinitmaxHeight(child_ele);
            }
            /*--------------------------------------------------------------------- */
            child_ele.classList.toggle('active');
         
            if(child_ele.classList.contains('active')){
                child_ele.classList.toggle('disappear');
                if(type === 'large'){
                    animation.slideDownLarge(parents_ele, child_ele);
                }
                else{
                    animation.slideDownMiddle(child_ele);
                }
            }
            else{
                if(type === 'large'){
                    animation.slideUpLarge(parents_ele);
                }
                else{
                    animation.slideUpMiddle(child_ele);
                }
                setTimeout(()=>{
                    child_ele.classList.toggle('disappear');
                },650);
            }

            newbtn.classList.toggle('btn_active');
            e.stopPropagation();
        });

        /* 버튼 외 구역 눌러도 펼쳐지고 접어지게 */
        parents_ele.addEventListener('click', (e)=>{
            newbtn.click();
            e.stopPropagation();
        },false);

        return newbtn;
    }
    createCategoryElement(){
        //대분류 Html코드를 여기에 담은뒤 for문 돌려서 mainContent에 추가할거임
        let categoryelements = [];
        
        //대분류 순서대로 돌려 Html만드는 코드
        this.largedisease.forEach(element => {
            const largeElement = document.createElement('div');
            largeElement.classList.add('category_largedisease');
            largeElement.setAttribute('data-issetmaxheight', true);

            const largeelementHeader = document.createElement('div');
            largeelementHeader.classList.add('category_largedisease_content');

            const childmiddleEle = this.createMediumsDisease(element);

            const largetomiddleBtn = this.createBtn(childmiddleEle, largeElement, 'large');
            /*-------------largeElement Header부분 만드는 곳 ---------------*/
            largeelementHeader.innerHTML=`
                <a href="#"><div class="category_header_text">${element}</div></a>
            `;
            largeelementHeader.appendChild(largetomiddleBtn);
            /*------------------ -----------------------------------------*/
            
            largeElement.appendChild(largeelementHeader);//header추가
            largeElement.appendChild(childmiddleEle);//childmiddle 추가(=middlediseas 리스트 추가);
            categoryelements.push(largeElement);
        });

        /*---------------------------------대분류를 mainContent에 삽입하는 코드----------------------------- */
        categoryelements.forEach(ele=> {
            this.mainContent.appendChild(ele)
        });
    }
    createMediumsDisease(large_ele){
        const middlediseases = knowledgeData.large_to_mediums[large_ele];

        const mediumElement = document.createElement('div');
        mediumElement.classList.add('category_middledisease');
        mediumElement.setAttribute('data-issetmaxheight', true);
        mediumElement.classList.add('disappear');

        middlediseases.forEach(element => {
            const newmiddleEle = document.createElement('div');
            newmiddleEle.classList.add('category_middledisease_content');
            newmiddleEle.setAttribute('data-issetmaxheight', true);

            const childsmallEle = this.createSmallDisease(element);

            const middleHeaderEle = document.createElement('div');
            middleHeaderEle.classList.add('category_middledisease_content_header');
            middleHeaderEle.innerHTML = `
                <a href="#"><div class="category_header_text">${element}</div></a>
            `;

            if(childsmallEle){
                const middletosmallBtn = this.createBtn(childsmallEle, newmiddleEle, 'middle');
                middleHeaderEle.appendChild(middletosmallBtn);
            }
            
            newmiddleEle.appendChild(middleHeaderEle);
            if(childsmallEle) newmiddleEle.appendChild(childsmallEle);

            mediumElement.appendChild(newmiddleEle);
        }); 
        
        return mediumElement
    }
    createSmallDisease(middle_ele){
        const smalldiseases = knowledgeData.medium_to_smalls[middle_ele];
        if(smalldiseases){
            const smallEle = document.createElement('div');
            smallEle.classList.add('category_smalldisease');
            smallEle.classList.add('disappear');
    
            smalldiseases.forEach(element => {
                const smallitem = document.createElement('div');
                const smalldiseaseurl = '/knowledges/disease/'+ (element.id).toString();
    
                smallitem.classList.add('category_smalldisease_content');
                smallitem.innerHTML =`
                    <a href= ${smalldiseaseurl} %}><div class="category_header_text">${element.name}</div></a>
                `;
    
                smallEle.appendChild(smallitem);
            });
            return smallEle;
        }
        //아무것도 없으면 안나와야하는데 ... !고쳐야 할점!
        return null;
    }
}

window.onload = ()=>{
    new DiseaseCategory();
}