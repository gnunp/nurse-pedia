import {animation} from '../../global/js/animation';

class DiagnosisCategory{
    constructor(){
        
        this.mainContent = document.querySelector('.dia_cat_mainContent');
        this.largedisease = knowledgeData.large_diagnoses;
        this.spreadspeed = 0.1;

        this.createCategoryElement();
    }
    createBtn(child_ele, parents_ele, type){
        const newbtn = document.createElement('button');
        newbtn.classList.add('context_btn');
        newbtn.setAttribute('type', `${type}`);
        newbtn.innerText = "◀";

        /*--------------------버튼 클릭시 발생되는 이벤트 ---------------- */
        newbtn.addEventListener('click',()=>{
            /*-----------------처음 Height값 저장(첫번째 클릭에만 실행) -------------- */
            if(parents_ele.dataset.issetmaxheight == 'true'){
               animation.setinitmaxHeight(child_ele);
            }
            /*--------------------------------------------------------------------- */
            child_ele.classList.toggle('active');
        
            /*active가 없으면 닫히는것 active가 있으면 열리는것 */
            //열리는 부분
            if(child_ele.classList.contains('active')){
                child_ele.classList.toggle('disappear');
                if(type === 'large'){
                    animation.slideDownLarge(parents_ele, child_ele);
                }
                else{
                    animation.slideDownMiddle(child_ele);
                }
            }
            //닫히는 부분
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
        });

        return newbtn;
    }
    createControlBtn(){
        const controlbtns = document.createElement('div');
        const closebtn = document.createElement('button');
        const openbtn = document.createElement('button');

        controlbtns.classList.add('controlbox');
        closebtn.classList.add('controlbtn');
        openbtn.classList.add('controlbtn');

        closebtn.innerText ="접기";
        openbtn.innerText ="펼치기";

        //접기 버튼을 눌렀을 경우
        closebtn.addEventListener('click', ()=>{
            const target = document.querySelectorAll('.btn_active[type="large"]');
            target.forEach(element => {
                element.click();
            });
        });

        //펼치기 버튼을 눌렀을 경우
        openbtn.addEventListener('click', function(){
            const large_target = document.querySelectorAll('[type="large"]:not(.btn_active)');
            const middle_target = document.querySelectorAll('[type="middle"]:not(.btn_active)');

            large_target.forEach(element => {
                element.click();
            });

            middle_target.forEach(element => {
                element.click();
            });       
        });
        
        controlbtns.appendChild(closebtn);
        controlbtns.appendChild(openbtn);

        return controlbtns;
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

        /*---------------------------------전체 펼치기 전체 접기 버튼 만드는 코드 --------------------------------*/
        this.mainContent.appendChild(this.createControlBtn()); 

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

            const middletosmallBtn = this.createBtn(childsmallEle, newmiddleEle, 'middle');

            const middleHeaderEle = document.createElement('div');
            middleHeaderEle.classList.add('category_middledisease_content_header');
            middleHeaderEle.innerHTML = `
                <a href="#"><div class="category_header_text">${element}</div></a>
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
            const smalldiseaseurl = '/knowledges/disease/'+ (element.id).toString();

            smallitem.classList.add('category_smalldisease_content');
            smallitem.innerHTML =`
                <a href= ${smalldiseaseurl} %}><div class="category_header_text">${element.name}</div></a>
            `;

            smallEle.appendChild(smallitem);
        });
        return smallEle;
    }
}

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
    /*new DiagnosisCategory();*/
    new newDiagnosisCategory();
}