import css from "../css/diagnosis_detail.css";
import Secondpage from "./secondpage.js";
class DiagnosisDetail{
    constructor(){
        this.findNode =document.querySelector('.title_word').textContent;
        new Secondpage(true, this.findNode);
    }
}

window.onload = () =>{
    new DiagnosisDetail();
}