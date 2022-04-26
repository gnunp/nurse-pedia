import "regenerator-runtime/runtime.js";
import {search} from "./utils/search";
import {toastMessage} from "./utils/toastMessage";
import {headerHeight} from "./variables";
import {userModal} from "./utils/userModal";

/*------------------비로그인이면 userModal기능 제공하는 함수 실행하기-------------------*/
if(!userIsAuthenticated){
    await userModal();
}


/*--------------------#root element를 header의 height만큼 띄우기--------------------*/
if((location.pathname !== "/") && (location.pathname !== "/knowledges/mindmap/")){
    const rootElement = document.querySelector('#root');
    rootElement.style.top = `${headerHeight}px`;
}

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
const headerSearchBar = document.querySelector('.js-search_wrapper');

if(location.pathname == "/"){
    headerSearchBar.remove();
}
await search(); // 검색창 기능을 제공 하는 함수 실행


/*-----------------------Header 검색창 placeholder outfocus일때 나타내기----------------------------*/
headerSearchBar.addEventListener("focusout",(e)=>{
    if(!e.target.value){
        e.target.placeholder ="간호 지식 검색";
    }
})

/*------------personal_info 창 열고 닫기----------------------- */
const personalbtn = document.querySelector('.personal_btn');
const subwindow = document.querySelector('.personal_info');
const closebtn = document.querySelector('.close_btn');

personalbtn.addEventListener('click', ()=>{
    console.log("왜 안되냐?");
    subwindow.classList.toggle('unactive');
});

closebtn.addEventListener('click',()=>{
    console.log("왜 안되냐?222");
    subwindow.classList.toggle('unactive');
});

/*----------Django Message가 있는지 확인 하고, 있으면 Toast Message 띄우는 코드------------ */
const djangoMessages = document.querySelectorAll('.js-django_messages > span');
if(djangoMessages.length > 0){
    console.log(djangoMessages);
    let resultMessage = '';
    for (const djangoMessage of djangoMessages) {
        console.log(djangoMessage)
        resultMessage += `${djangoMessage.innerText}<br>`;
    }
    console.log(resultMessage);
    toastMessage(resultMessage.trimEnd());
}