import css from '../css/mypage.css';

import {headerHeight} from '../../global/js/global';

class Mypage{
    constructor(){
        this.setInit();
        this.navClickevent();

        this.currentActiveNavitem = document.querySelector('.active');
    }

    navClickevent(){
        this.navitems = document.querySelectorAll('.nav_item');
        const content_title = document.querySelector('.mypage_content h1');

        this.navitems.forEach(element => {
            element.addEventListener('click', (e)=>{
                const activetitle = element.textContent;
                content_title.textContent = `${activetitle}`;

                if(this.currentActiveNavitem){
                    this.currentActiveNavitem.classList.toggle('active');
                }
                this.currentActiveNavitem = element;
                element.classList.toggle('active');
            })
        });
    }

    setInit(){
        const mypage = document.querySelector('.mypage_wrap');
        mypage.style.top = `${headerHeight}px`;
    }
}

window.onload = ()=>{
    new Mypage();
}