class Home{
    constructor(){
        this.stageHeight = window.innerHeight;    
    
        // setting init wheel event
        this.pagewrap = document.querySelector('.wrappage');
        this.page = 0;
        this.maxpage = 1;
        this.ismove = true;

        window.addEventListener('resize',this.resize.bind(this));
        window.addEventListener('wheel', this.movePage.bind(this));
    }
    movePage(e){
        if(this.ismove){
            this.ismove = false
            let wheelvalue = e.wheelDelta;
            switch(wheelvalue){
                case -180:
                    if (this.page < this.maxpage){
                        this.page ++;
                    }
                    break;
                case 180:
                    if(this.page > 0){
                        this.page--;
                    }
                    break;
            }
            this.pagewrap.style.transform = `translateY(${-this.stageHeight * this.page}px)`;
            setTimeout(()=>{
                this.ismove = true;
            },500);
        }
    }
    resize(){
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;
        this.pages = document.querySelectorAll('.page');
        this.pages.forEach(element => {
            element.style.width = this.stageWidth;
            element.style.height = this.stageHeight;
        });
  

    }

    
}

window.onload = ()=>{
    new Home();
}