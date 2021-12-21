import home_css from "../css/home.css";
import firstpage_css from "../css/firstpage.css";
import "./search.js";

class Home{
    constructor(){
        this.setinitSize(); 
   
        // setting init wheel event
        this.pagewrap = document.querySelector('.wrappage');
        this.page = 0;
        this.maxpage = 1;
        this.ismove = true;
        this.canMove = true;

        document.querySelector('.cy_wrap').addEventListener('mouseover',()=>{
            this.canMove = false;
        });
        document.querySelector('.cy_wrap').addEventListener('mouseleave',()=>{
            console.log("out!");
            this.canMove = true;
        });

        window.addEventListener('resize',this.resize.bind(this));
        window.addEventListener('wheel', this.movePage.bind(this));
    }

    resize(){
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;
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
        if(this.ismove && this.canMove){
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

window.onload = async () => {
    new Home();

    const { default: Secondpage } = await import('./secondpage.js');
    //secondpage 
    const secondpage = new Secondpage();
}