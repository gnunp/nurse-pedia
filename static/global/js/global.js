import "regenerator-runtime/runtime.js";
import reset_css from "../css/reset.css";
import global_css from "../css/global.css";
import user_css from "../../users/css/user_modal.css";
import global_color from "../css/color.css";

window.addEventListener('resize',()=>{
    let pages = document.querySelectorAll('.page');
    let stageWidth = window.innerWidth;
    let stageHeight = window.innerHeight;

    pages.forEach(element => {
        element.style.width = `${stageWidth}px`;
        element.style.height = `${stageHeight}px`;
    });
});

/*---------------------------header nav바 이벤트-----------------------------------*/
const navitems = document.querySelectorAll('.global_nav_item');
const subnavs = document.querySelectorAll('.subnav');

//nav바 마우스 오버와 리브에 따른 이벤트
navitems.forEach(element => {
    element.addEventListener('mouseover', (e)=>{
        const activeId =e.target.dataset.id; 
        if(activeId){
            subnavs[activeId-1].classList.toggle('disappear', false);
            subnavs[activeId-1].classList.toggle('activenav', true);
        }
    });
    element.addEventListener('mouseleave', ()=>{
        subnavs.forEach(element => {
            element.classList.toggle('disappear', true);
            element.classList.toggle('activenav', false);
        });
    });
});

/*-----------------------Header 검색창 나타냄 유무----------------------------*/ 
const headerSearchBar = document.querySelector('.nav_searchbar');
const currenthref = location.href;
const isactiveSearchBar = (/knowledges/).test(currenthref) | (/users/).test(currenthref);

if(isactiveSearchBar){
    headerSearchBar.classList.toggle("disappear", false);
}
else{
    headerSearchBar.classList.toggle("disappear", true);
}

/*-----------------------Header 검색창 placeholder outfocus일때 나타내기----------------------------*/ 
headerSearchBar.addEventListener("focusout",(e)=>{
    if(!e.target.value){
        e.target.placeholder ="간호 지식 검색";
    }
});

/*--------------------------Personal_inofo logo color setting ------------------------------ */

const colores =['#FFC0CB','#574145', '#BEA5A9','#99DDCF','#63A699'];
const randnum = Math.floor(Math.random()*colores.length);
const currentcolor = colores[randnum];

const personalbtns = [document.querySelector('.personal_btn_subwindow'), document.querySelector('.personal_btn')];
    
personalbtns.forEach(element => {
    element.style.color = currentcolor;
});
const mypage_btn = document.querySelector('.mypage_btn'); 
mypage_btn.addEventListener('mouseenter',(e)=>{
    mypage_btn.style.backgroundColor=currentcolor;
    mypage_btn.style.color = 'white';
});
mypage_btn.addEventListener('mouseleave',()=>{
    mypage_btn.style.backgroundColor='white';
    mypage_btn.style.color = 'black';
});
mypage_btn.addEventListener('click', ()=>{
    window.location.href='/users/mypage';
})

/*------------personal_info 창 열고 닫기----------------------- */
const personalbtn = document.querySelector('.personal_btn');
const subwindow = document.querySelector('.personal_info');
const closebtn = document.querySelector('.close_btn');

if(personalbtn){
    personalbtn.addEventListener('click', ()=>{
        subwindow.classList.toggle('unactive');
    });
}

if(closebtn){
    closebtn.addEventListener('click',()=>{
        subwindow.classList.toggle('unactive');
    });
}