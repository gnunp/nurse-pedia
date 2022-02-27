import css from "../css/diagnosis_detail.css";
import Secondpage from "./secondpage.js";
import {headerHeight} from '../../global/js/global';

class DiagnosisDetail{
    constructor(){
        this.findNode =document.querySelector('.title_word').textContent;
        new Secondpage(true, this.findNode);
        this.setInit();
    }

    setInit(){
    this.diagnosisDetailWrap = document.querySelector('.diagnosis_detail_wrap');
        this.diagnosisDetailWrap.style.top =`${headerHeight}px`;
        
    }
}

window.onload = () =>{
    new DiagnosisDetail();
}