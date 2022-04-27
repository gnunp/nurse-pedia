/* SCSS */
import "../../../scss/pages/mindmap-page.scss";

/* JS */
import Mindmap from '../../utils/mindmap';

class Main {
    constructor(){
        new Mindmap();
    }
}

window.onload = ()=>{
    new Main();
} 
