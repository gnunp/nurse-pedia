import Mindmap from "./mindmap.js";
import {headerHeight} from '../../global/js/global';
import { shuffle } from "lodash";

class DiseaseDetail{
    constructor(){
        this.setInit();
        this.colors = [
            '#D8E2DC',
            '#FFE5D9',
            '#FFCAD4',
            '#F4ACB7',
            '#C6B5BA',
        ]

        this.relativeDiagnoses = document.querySelectorAll('.relative_diagnoses__item');
        if(this.relativeDiagnoses){
            this.colorSet();
        }

        this.findNode =document.querySelector('.js-knowledge_name').textContent;
        new Mindmap(true, this.findNode);
    }
    setInit(){
        this.diseaseDetailWrap = document.querySelector('.root');
        this.diseaseDetailWrap.style.top = `${headerHeight}px`;
    }

    colorSet(){
        this.relativeDiagnoses.forEach((diagnosis, index) => {
            if(index % this.colors.length === 0){
                this.colors = shuffle(this.colors);
            }
            diagnosis.style.backgroundColor=this.colors[index % this.colors.length];
        });
    }
}

window.onload = ()=>{
    new DiseaseDetail();
}