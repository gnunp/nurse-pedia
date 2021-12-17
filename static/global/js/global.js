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