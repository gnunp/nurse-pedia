import css from '../css/mypage.css';

import {headerHeight} from '../../global/js/global';

class Mypage{
    constructor(){
        this.setInit();
        this.navClickevent();

        this.currentActiveNavitem = document.querySelector('.active');
    }

    async createstarcontent(){
        const starknowledge = await fetch('/api/knowledges/user-star-knowledges/');
        console.log(starknowledge);
        const jsonstarknowledge = await starknowledge.json();
    
        const starcontent = document.createElement('div');
        starcontent.classList.add('starcontent');
        

        let url, type, id, name;
        jsonstarknowledge.forEach(element => {
            console.log(JSON.stringify(element));

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

        console.log(starcontent);
        document.querySelector('.content').appendChild(starcontent);
    }

    createstaritem(name, url){
        const newitem = document.createElement('div');
        newitem.classList.add('staritem');

        newitem.innerHTML =`
            <a href=${url}><h1>${name}</h1></a>
        `
        return newitem;
    }

    navClickevent(){
        this.navitems = document.querySelectorAll('.nav_item');
        const content_title = document.querySelector('.mypage_content h1');

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
                if(activetitle == "내가 찜한 페이지"){
                    this.createstarcontent();
                }
            
            })
        });
    }

    setStarKnowledges(){

    }

    setInit(){
        const mypage = document.querySelector('.mypage_wrap');
        mypage.style.top = `${headerHeight}px`;
    }
}

window.onload = ()=>{
    new Mypage();
}