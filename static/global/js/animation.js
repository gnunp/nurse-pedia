class Animation{
    constructor(){
        this.speed = 0.1;
    }

    slideDown(ele, addmaxHeight ){
        ele.style.maxHeight = "100vh";
    }
    slideUp(ele, to){
        ele.style.maxHeight = `${to}px`;
    }

}

export const animation = new Animation();