export const setMobileSideMenuEvent = () =>{
    const mobileMenuIcon = document.querySelector('.js-mobile_menu');
    const mobileSideMenuWrapper = document.querySelector('.js-mobile_side_menu_wrapper');

    const sideMenu = document.querySelector('.js-side_menu');
    mobileMenuIcon.addEventListener('click', handleClickMobileMenuIcon);

    const closeSideMenuIcon = document.querySelector('.js-close_side_menu_btn');
    closeSideMenuIcon.addEventListener('click', handleClickCloseMobileMenuIcon);

    mobileSideMenuWrapper.addEventListener('click', handleClickWrapperBackground);

    function handleClickMobileMenuIcon(event){
        mobileSideMenuWrapper.classList.add("js-display_flex");
        setTimeout(() =>{
            mobileSideMenuWrapper.classList.add("js-opacity_1");
            sideMenu.classList.add("js-opacity_1");
        },100)
    }

    function handleClickCloseMobileMenuIcon(event){
        closeSideMenu()
    }

    function closeSideMenu(){
        mobileSideMenuWrapper.classList.remove("js-opacity_1");
        sideMenu.classList.remove("js-opacity_1");
        setTimeout(() =>{
            mobileSideMenuWrapper.classList.remove("js-display_flex");
        },400)
    }

    function handleClickWrapperBackground(event){
        if(!event.target.closest('.js-side_menu')){
            closeSideMenu();
        };
    }


}