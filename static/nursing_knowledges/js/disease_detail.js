import css from "../css/disease_detail.css";
import Secondpage from "./secondpage.js";

class DiseaseDetail{
    constructor(){
        this.colors = {
            1 : '#D6D6D6',
            2 : '#FFE5D9',
            3 : '#FFCAD4',
            4 : '#F4ACB7',
            5 : '#C6B5BA',
        }

        this.relative_diagnosis_btns = document.querySelectorAll('.diagnosis_btn');
        if(this.relative_diagnosis_btns){
            this.colorSet();
        }
        this.findNode =document.querySelector('.title_word').textContent;
        new Secondpage(true, this.findNode);
    }

    colorSet(){
        let randnum;
        this.relative_diagnosis_btns.forEach(element => {
            randnum = Math.round(Math.random()*4) + 1;
            element.style.backgroundColor=this.colors[randnum];
        });
    }
}

window.onload = ()=>{
    new DiseaseDetail();
}