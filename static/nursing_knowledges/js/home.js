import home_css from "../css/home.css";
import firstpage_css from "../css/firstpage.css";
import "./search.js";
class Home{
    constructor(){
        //디바이스가 모바일 인지 아닌지 판단
        let userAgent = navigator.userAgent.toLowerCase();
        const regex = new RegExp('mobile');
        let isMobile = regex.test(userAgent);
   
        // setting init wheel event


        if(isMobile){
           this.mobileSetting();
        }
        else{
            this.setinitSize(); 
            window.addEventListener('wheel', this.movePage.bind(this));
                
            document.querySelector('.cy_wrap').addEventListener('mouseover',()=>{
                this.canMove = false;
            });
            document.querySelector('.cy_wrap').addEventListener('mouseleave',()=>{
                this.canMove = true;
            });
        }
        
    }

    setinitSize(){
        //스크롤 위치 맨위로 초기화
        window.scrollTo(0,0);

        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;

        const pages = document.querySelectorAll('.page');

        pages.forEach(element => {
            element.style.width = `${this.stageWidth}px`;
            element.style.height = `${this.stageHeight}px`;
        });
    }

    mobileSetting(){
        this.mobile_can_move = false;
        this.mobile_start_posX;
        this.mobile_end_posX;

        window.addEventListener('touchstart', this.movepage_mobile_start.bind(this));
        window.addEventListener('touchmove',this.movepage_mobile_continue.bind(this));
        window.addEventListener('touchend',this.movepage_mobile_end.bind(this));
    }
    movepage_mobile_start(e){
        this.mobile_can_move = true;
        this.mobile_start_posX = e.clientX;
    }
    movepage_mobile_continue(e){
        let vector_x;
        const max_value = 50;
        if(this.mobile_can_move){
            vector_x = e.clientX - this.mobile_start_posX;
            if(vector_x > max_value) vector_x = max_value;

            this.pagewrap.style.transform = `translateX(${vector_x}px)`;
        }

    }
    movepage_mobile_end(e){
        let vector_x;
        const max_value = 50;
        if(this.mobile_can_move){
            this.mobile_can_move = false;
            this.mobile_end_posX = e.clientX;

            vector_x = this.mobile_end_posX - this.mobile_start_posX;
            if(vector_x < max_value){
                this.pagewrap.style.transform = `translateX(${0}px)`;
            }
            else{
                //와우 고칠거 겁나 많네...
            }

        }
    }

    movePage(e){
        this.pagewrap = document.querySelector('.wrappage');
        this.page = 0;
        this.maxpage = 1;
        this.ismove = true;
        this.canMove = true;

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