import home_css from "../css/home.css";
import firstpage_css from "../css/firstpage.css";

import {Secondpage} from "./secondpage.js";

class Home{
    constructor(){
        this.setinitSize(); 
        //secondpage 
        this.secondpage = new Secondpage();
   
        // setting init wheel event
        this.pagewrap = document.querySelector('.wrappage');
        this.page = 0;
        this.maxpage = 1;
        this.ismove = true;

        window.addEventListener('resize',this.resize.bind(this));
        window.addEventListener('wheel', this.movePage.bind(this));
    }

    resize(){
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;

        this.secondpage.setpageSize();
    }

    setinitSize(){
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;

        const pages = document.querySelectorAll('.page');

        pages.forEach(element => {
            element.style.width = `${this.stageWidth}px`;
            element.style.height = `${this.stageHeight}px`;
        });
    }

    movePage(e){
        if(this.ismove){
            this.ismove = false
            let wheelvalue = e.wheelDelta;
            if(wheelvalue < 0){
                if(this.page < this.maxpage) this.page ++;
            }
            else if(wheelvalue > 0){
                if(this.page > 0) this.page--;
            }

            this.pagewrap.style.transform = `translateY(${-this.stageHeight * this.page}px)`;
            setTimeout(()=>{
                this.ismove = true;
            },500);
        }
    }
    
}

window.onload = ()=>{
    new Home();
}