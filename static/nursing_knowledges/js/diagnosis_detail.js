import Secondpage from "./secondpage.js";
import {headerHeight} from '../../global/js/global';

class DiagnosisDetail{
    constructor(){
        this.setInit();
        this.findNode =document.querySelector('.js-knowledge_name').textContent;
        new Secondpage(true, this.findNode);
    }

    setInit(){
        this.diagnosisDetailWrap = document.querySelector('.root');
        this.diagnosisDetailWrap.style.top =`${headerHeight}px`;
    }
}

window.onload = () =>{
    new DiagnosisDetail();
}