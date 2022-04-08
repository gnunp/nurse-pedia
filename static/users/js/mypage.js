import css from '../css/mypage.css';

import {headerHeight} from '../../global/js/variables';

class Mypage{
    constructor(){
        this.setInit();
        this.navClickevent();

        this.currentActiveNavitem = document.querySelector('.active');
    }
    
    setInit(){
        const mypage = document.querySelector('.mypage_wrap');
        mypage.style.top = `${headerHeight}px`;

        /*----------html 미리 만드는 코드----------- */
        this.createstarcontent();
        this.createhistorycontent();
    }

    /*-------------------------내가 찜한 페이지 document element만드는 코드 ----------------- */
    async createstarcontent(){
        const starknowledge = await fetch('/api/knowledges/user-star-knowledges/');
        const jsonstarknowledge = await starknowledge.json();
        const starcontent = document.querySelector('.star_info');
        
        let url, type, id, name;
        jsonstarknowledge.forEach(element => {
            if(element.disease_small_category__id){
                type = "disease";
                id = element.disease_small_category__id;
                
                url = `/knowledges/${type}/${id}`;
                name = element.disease_small_category__name;
            }
            else{
                type = "diagnosis";
                id = element.diagnosis_small_category__id;
                
                url = `/knowledges/${type}/${id}`;
                name = element.diagnosis_small_category__name;
            }

            starcontent.appendChild(this.createstaritem(name, url)); 
        });

        starcontent.classList.add('disappear');
    }
    createstaritem(name, url){
        const newitem = document.createElement('div');
        newitem.classList.add('staritem');

        newitem.innerHTML =`
            <a href='${url}'><h1>${name}</h1></a>
        `
        return newitem;
    }

    /*-----------------내가 열어본 페이지 document element 만드는 코드 ----------------- */
    createhistorycontent(){
        const historycontent = document.querySelector('.history_info');

        if(localStorage.length>0){
            const pagehistory = JSON.parse(localStorage.getItem('pageHistory'));

            pagehistory.forEach(element => {
                console.log(element);
                historycontent.appendChild(this.createhistoryitem(element));
            });
        }

        historycontent.classList.add('disappear');
    }
    createhistoryitem(ele){
        const name = ele.name;
        const address = `/${ele.address}`;
        const date = ele.date;

        const newitem = document.createElement('li');
        newitem.classList.add('historyitem');

        newitem.innerHTML=`
            <a href='${address}'>${date} - <span style="color:#FF6565;font-weight:900;">${name}</span></a>
        `
        return newitem;
    }

    /*------------------------------왼쪽 global_nav바 클릭 이벤트-----------------------*/
    navClickevent(){
        this.navitems = document.querySelectorAll('.nav_item');
        const content_title = document.querySelector('.mypage_content h1');
        let currentinfo = document.querySelector('.update_info');

        this.navitems.forEach(element => {
            element.addEventListener('click', (e)=>{
                //active 클래스 변경
                if(this.currentActiveNavitem){
                    this.currentActiveNavitem.classList.toggle('active');
                }
                this.currentActiveNavitem = element;
                element.classList.toggle('active');

                /*-------------------content Title수정------------------------*/
                const activetitle = element.textContent;
                content_title.textContent = `${activetitle}`;

                /*-------------main content수정 ------------*/
                switch (activetitle) {
                    case "내 정보 수정":
                        currentinfo.classList.add('disappear');
                        currentinfo = document.querySelector('.update_info');
                        currentinfo.classList.remove('disappear');
                        break;

                    case "내가 찜한 페이지":
                        currentinfo.classList.add('disappear');
                        currentinfo = document.querySelector('.star_info');
                        currentinfo.classList.remove('disappear');
                        break;

                    case "내가 열어본 페이지":
                        currentinfo.classList.add('disappear');
                        currentinfo = document.querySelector('.history_info');
                        currentinfo.classList.remove('disappear');
                        break;
                    case "개발자에게 쪽지 보내기":
                        currentinfo.classList.add('disappear');
                        currentinfo = document.querySelector('.develop_info');
                        currentinfo.classList.remove('disappear');
                        break;
                    default:
                        break;
                }
            })
        });
    }
    setStarKnowledges(){
    }
}

window.onload = ()=>{
    new Mypage();
}