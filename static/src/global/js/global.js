import "regenerator-runtime/runtime.js";
import {setSearchEvent} from "./utils/setSearchEvent";
import {toastMessage} from "./utils/toastMessage";
import {headerHeight} from "./variables";
import {userModal} from "./utils/userModal";
import {setMobileSideMenuEvent} from "./utils/setMobileSideMenuEvent";

const globalInit = async () => {
    setMobileSideMenuEvent();
    await userModalInit();
    setNavbarEvent();
    await setSearchEvent();
    addSearchBarPlaceholder();
    setPersonalInfo();
    showDjangoToastMessage();

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
    function setPersonalInfo() {
        if(userIsAuthenticated){
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