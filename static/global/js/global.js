import "regenerator-runtime/runtime.js";
import reset_css from "../css/reset.css";
import global_css from "../css/global.css";
import user_css from "../../users/css/user_modal.css";
import global_color from "../css/color.css";

window.addEventListener('resize',()=>{
    let pages = document.querySelectorAll('.page');
    console.log(pages);
    let stageWidth = window.innerWidth;
    let stageHeight = window.innerHeight;

    pages.forEach(element => {
        element.style.width = `${stageWidth}px`;
        element.style.height = `${stageHeight}px`;
    });
});

/*-------------header nav바 이벤트-------------*/
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

/*---------------Header 검색창 나타냄 유무---------------*/ 
const headerSearchBar = document.querySelector('.nav_searchbar');
//주소를 받아서 디테일 페이지 인지 유무를 해야하는데 그런 코드 어캐짜지