import CSS from '../css/diagnosis_category.css';

import {headerHeight} from "../../global/js/variables";

class newDiagnosisCategory{
    constructor(){
        this.colors = [
            '#D8E2DC',
            '#FFE5D9',
            '#FFCAD4',
            '#F4ACB7',
            '#C6B5BA',
        ];
        console.log(knowledgeData);
        this.createcontent();

    }
    createcontent(){
        const maincontentdiv = document.querySelector('.dia_cat_mainContent');
        maincontentdiv.classList.add('maincontentdiv');
        maincontentdiv.style.top = `${headerHeight}px`;

        const largeDiagnoses = knowledgeData.large_diagnoses;
        const largeToMediums = knowledgeData.large_to_mediums;
        const mediumToSmall = knowledgeData.medium_to_smalls;

        largeDiagnoses.forEach(element => {
            const largeitem = element;
            const middleDiagnoses = largeToMediums[largeitem];
            
            middleDiagnoses.forEach(ele => {
                const middleitem = ele;
                const smalldiagnoses = mediumToSmall[middleitem];
                if(smalldiagnoses.length > 0){
                    const subcontent = document.createElement('div');
                    subcontent.classList.add('subcontent');
    
                    //subcontent title 넣기
                    const titlediv = this.createTitle(largeitem, middleitem);
                    subcontent.appendChild(titlediv);
                    
                    //subcontent item넣기
                    const itembox = document.createElement('div');
                    itembox.classList.add('itembox');
    
                    smalldiagnoses.forEach(element => {
                        const itemdiv = this.createitem(element.name, element.id);
                        itembox.appendChild(itemdiv);
                    });
                    subcontent.appendChild(itembox);
    
                    //subcontent를 maincontent에 넣기
                    maincontentdiv.appendChild(subcontent);        
                }
            });
            
        });
    }

    createTitle(large, middle){
        const titlediv = document.createElement('div');
        titlediv.classList.add('titlediv');
        titlediv.innerHTML = `<h1>${large} <span style="font-size:1.5rem; text-align:center;">▶</span> ${middle}</h1>`;

        return titlediv;
    }

    createitem(name, id){
        const newitem = document.createElement('div');
        newitem.classList.add('item');

        //배경색 지정
        const colornum = Math.round(Math.random()*4);
        newitem.style.backgroundColor = `${this.colors[colornum]}`;

        //클릭시 페이지 이동
        const url = `/knowledges/diagnosis/${id}`;
        newitem.textContent = `${name}`;
        newitem.addEventListener('click',()=>{
            window.location.href=`${url}`;
        });

        return newitem;
    }
}

window.onload = ()=>{
    new newDiagnosisCategory();
}