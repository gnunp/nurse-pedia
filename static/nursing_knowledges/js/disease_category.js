import '../css/disease_category.css';

import {headerHeight} from '../../global/js/global';

class DiseaseCategory{
    constructor(){
        this.mainContent = document.querySelector('.dis_cat_mainContent');
        this.largedisease = knowledgeData.large_diseases;
        console.log(knowledgeData);

        this.setInitStyle();
        this.createCategoryElement();
    }
    setInitStyle(){
        /*--------------Header높이 만큼 위에서 떨어트림--------------- */
        this.mainContent.style.top = `${headerHeight}px`;
    }
    createBtn(child_ele, parents_ele){
        const newbtn = document.createElement('button');
        newbtn.innerText = "▶";

        /*--------------------버튼 클릭시 발생되는 이벤트 ---------------- */
        newbtn.addEventListener('click',()=>{
            child_ele.classList.toggle('disappear');
            newbtn.classList.toggle('btn_active');
        });

        return newbtn;
    }
    createCategoryElement(){
        //대분류 Html코드를 여기에 담은뒤 for문 돌려서 mainContent에 추가할거임
        let categoryelements = [];
        
        //대분류 순서대로 돌려 Html만드는 코드
        this.largedisease.forEach(element => {
            const largeElement = document.createElement('div');
            largeElement.classList.add('category_largedisease');

            const largeelementHeader = document.createElement('div');
            largeelementHeader.classList.add('category_largedisease_content');

            const childmiddleEle = this.createMediumsDisease(element);

            const largetomiddleBtn = this.createBtn(childmiddleEle, largeElement);

            /*-------------largeElement Header부분 만드는 곳 ---------------*/
            largeelementHeader.innerHTML=`
                <h1>${element}</h1>
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
        mediumElement.classList.add('disappear');

        middlediseases.forEach(element => {
            const newmiddleEle = document.createElement('div');
            newmiddleEle.classList.add('category_middledisease_content');

            const childsmallEle = this.createSmallDisease(element);

            const middletosmallBtn = this.createBtn(childsmallEle);

            const middleHeaderEle = document.createElement('div');
            middleHeaderEle.classList.add('category_middledisease_content_header');
            middleHeaderEle.innerHTML = `
                <h1>${element}</h1>
            `;
            middleHeaderEle.appendChild(middletosmallBtn);
            
            newmiddleEle.appendChild(middleHeaderEle);
            newmiddleEle.appendChild(childsmallEle);
            mediumElement.appendChild(newmiddleEle);
        }); 
        
        return mediumElement
    }
    createSmallDisease(middle_ele){
        const smalldiseases = knowledgeData.medium_to_smalls[middle_ele];
        const smallEle = document.createElement('div');
        smallEle.classList.add('category_smalldisease');
        smallEle.classList.add('disappear');

        smalldiseases.forEach(element => {
            const smallitem = document.createElement('div');
            smallitem.classList.add('category_smalldisease_content');
            smallitem.innerHTML =`
                <h1>${element}</h1>
            `;

            smallEle.appendChild(smallitem);
        });
        return smallEle;
    }
}

window.onload = ()=>{
    new DiseaseCategory();
}