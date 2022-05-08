import "regenerator-runtime/runtime.js";
import {setSearchEvent} from "./utils/setSearchEvent";
import {toastMessage} from "./utils/toastMessage";
import {userModal} from "./utils/userModal";
import {setMobileSideMenuEvent} from "./utils/setMobileSideMenuEvent";

const globalInit = async () => {
    setViewHeightProperty();  // 가장 먼저 실행되는게 UX상 좋을것 같음
    setMobileSideMenuEvent();
    await userModalInit();
    setNavbarEvent();
    await setSearchEvent();
    addSearchBarPlaceholder();
    setPersonalInfoLogoColor();
    setPersonalInfoEvent();
    showDjangoToastMessage();

    function setViewHeightProperty() {
        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        });
    }

    async function userModalInit() {
        if(!userIsAuthenticated){
            await userModal();
        }
    }

    function setNavbarEvent() {
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
    }

    function addSearchBarPlaceholder() {
        const headerSearchBar = document.querySelector('.js-search_wrapper');

        headerSearchBar.addEventListener("focusout",(e)=>{
            if(!e.target.value){
                e.target.placeholder ="간호 지식 검색";
            }
        })
    }

    function setPersonalInfoLogoColor() {
        if(!userIsAuthenticated){ return; }

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
    }

    function setPersonalInfoEvent() {
        if(!userIsAuthenticated){ return; }

        const personalbtn = document.querySelector('.personal_btn');
        const subwindow = document.querySelector('.personal_info');
        const closebtn = document.querySelector('.close_btn');

        personalbtn.addEventListener('click', ()=>{
            subwindow.classList.toggle('unactive');
        });

        closebtn.addEventListener('click',()=>{
            subwindow.classList.toggle('unactive');
        });
    }

    function showDjangoToastMessage() {
        const djangoMessages = document.querySelectorAll('.js-django_messages > span');
        if(djangoMessages.length > 0){
            let resultMessage = '';
            for (const djangoMessage of djangoMessages) {
                resultMessage += `${djangoMessage.innerText}<br>`;
            }
            toastMessage(resultMessage.trimEnd());
        }
    }
}

await globalInit();