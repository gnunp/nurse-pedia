export const setMobileSideMenuEvent = () =>{
    const mobileMenuIcon = document.querySelector('.js-mobile_menu');
    const mobileSideMenuWrapper = document.querySelector('.js-mobile_side_menu_wrapper');
    mobileMenuIcon.addEventListener('click', handleClickMobileMenuIcon);

    function handleClickMobileMenuIcon(event){
        mobileSideMenuWrapper.classList.add("js-display_flex");
        setTimeout(() =>{
            mobileSideMenuWrapper.classList.add("js-opacity_1");
        },100)
    }

    const closeSideMenuIcon = document.querySelector('.js-close_side_menu_btn');
    closeSideMenuIcon.addEventListener('click', handleClickCloseMobileMenuIcon);

    function handleClickCloseMobileMenuIcon(event){
        mobileSideMenuWrapper.classList.remove("js-opacity_1");
        setTimeout(() =>{
            mobileSideMenuWrapper.classList.remove("js-display_flex");
        },400)
    }
}