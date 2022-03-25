import home_css from "../css/home.css";
import firstpage_css from "../css/firstpage.css";
class Home{
    constructor(){
        //디바이스가 모바일 인지 아닌지 판단
        let userAgent = navigator.userAgent.toLowerCase();
        const regex = new RegExp('mobile');
        let isMobile = regex.test(userAgent);
   
        this.wrappage = document.querySelector('.wrappage');

        // 모바일 일 경우
        if(isMobile){
           this.mobileSetting();
        }
        //모바일이 아닌경우
        else{
            this.setinitSize(); 
            
            //페이지 크기 달라질 때 
            window.addEventListener('resize',this.setinitSize.bind(this));
        }
    }


    setinitSize(){
        const headerele = document.querySelector('.header');  

        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;
    }
}

window.onunload = ()=>{
   window.location.reload(true);
   history.go(0);
}

window.onload = async () => {
    new Home();
}