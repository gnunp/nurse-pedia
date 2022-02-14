import home_css from "../css/home.css";
import firstpage_css from "../css/firstpage.css";
import "./search.js";
class Home{
    constructor(){
        //디바이스가 모바일 인지 아닌지 판단
        let userAgent = navigator.userAgent.toLowerCase();
        const regex = new RegExp('mobile');
        let isMobile = regex.test(userAgent);
   
        const mindmapElement = document.querySelector('#cy');//이 요소 위 마우스 유무에 따라 mindmap확대인지 페이지 움직이는 것인지 정함
        this.wrappage = document.querySelector('.wrappage');

        // 모바일 일 경우
        if(isMobile){
           this.mobileSetting();
        }
        //모바일이 아닌경우
        else{
            this.setinitSize(); 

            //페이지 이동(마우스 위치에 따라 페이지 이동일지 mindmap 줌인지)
            mindmapElement.addEventListener('mouseover', ()=>{
                this.canMove = false;
            });
            mindmapElement.addEventListener('mouseleave', ()=>{
                this.canMove = true;
            });
            window.addEventListener('wheel', this.movePage.bind(this));
            
            //페이지 크기 달라질 때 
            window.addEventListener('resize',this.setinitSize.bind(this));
        }
    }


    setinitSize(){
        const pages = document.querySelectorAll('.page'); 
        const headerele = document.querySelector('.header');
        
        this.currentPage = 0;
        this.maxPagenum = 1;
        const addpagemoveVal = headerele.offsetHeight / 2;        

        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;

        this.pagemoveVal = this.stageHeight + addpagemoveVal;
        this.canMove= true;
        this.isMoving = false;

        pages.forEach(element => {
            element.style.width = `${this.stageWidth}px`;
            element.style.height = `${this.stageHeight}px`;
        });
    }

    movePage(e){
        const wheelValue = e.wheelDelta;

        if(this.canMove && !this.isMoving){
            this.isMoving = true;
            //휠을 다음페이지(아래)로 움직였을 경우
            if(wheelValue < 0){
                if(this.currentPage < this.maxPagenum){
                    this.currentPage++;
                }
            }
            //휠을 이전 페이지(위로)로 움직였을 경우
            else if(wheelValue > 0){
                if(this.currentPage > 0){
                    this.currentPage--;
                }
            }
            
            this.wrappage.style.top = `-${this.currentPage * this.pagemoveVal}px`;
            //움직이는 동안 wheel이벤트 못받게 막는것을 0.5초 뒤에 풀어줌
            setTimeout(()=>{
                this.isMoving = false;
            },500);
        }
    }

    // movePage(e){
    //     this.maxpage = 1;
    //     this.ismove = true;

    //     if(this.ismove && this.canMove){
    //         this.ismove = false
    //         let wheelvalue = e.wheelDelta;
    //         if(wheelvalue < 0){
    //             if(this.page < this.maxpage) this.page ++;
    //         }
    //         else if(wheelvalue > 0){
    //             if(this.page > 0) this.page--;
    //         }
    //         console.log(this.page);
    //         console.log(this.page * this.stageHeight);

    //         window.scrollTo(0, `-${this.page * this.stageHeight}px`);
    //         console.log(window.scrollY);
    //         setTimeout(()=>{
    //             this.ismove = true;
    //         },500);

    //     }
    // }
   
    /*모바일 세팅
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
*/
}

window.onunload = ()=>{
   window.location.reload(true);
   history.go(0);
}

window.onload = async () => {
    new Home();

    const { default: Secondpage } = await import('./secondpage.js');
    //secondpage 
    const secondpage = new Secondpage();
}