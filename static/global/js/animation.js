class Animation{
    constructor(){
        this.speed = 0.1;
    }

    parentsNodeArray(ele){
        let parents =[];
        let currentNode = ele;

        while(!currentNode.classList.contains("category_largedisease")){
            currentNode = currentNode.parentNode;
            parents.push(currentNode);
        }

        return parents;
    }

    setmaxHeight(child_ele){
        const parents = this.parentsNodeArray(child_ele);

        parents.forEach(element => {
            if(element.dataset.issetmaxheight == 'true'){
                element.setAttribute('data-issetmaxHeight', false);
                const initmaxHeight = element.clientHeight;
                element.setAttribute('data-initmaxheight', initmaxHeight);
                element.style.maxHeight=`${initmaxHeight}px`;
            }
        });
    }

    slideDownLarge(parents_ele, child_ele){
        const newMaxHeight = parents_ele.clientHeight + child_ele.clientHeight;
        parents_ele.style.maxHeight = `calc(${newMaxHeight}px + 1rem)`;
        parents_ele.style.minHeight = `calc(${newMaxHeight}px)`;
    }
    slideDownMiddle(node){
        const parents = this.parentsNodeArray(node);

        parents.forEach(element => {
            const newMaxHeight = element.clientHeight + node.clientHeight;
            element.style.maxHeight = `calc(${newMaxHeight}px + 1rem)`;
            element.style.minHeight = `calc(${newMaxHeight}px )`;
        });
    }
    slideUpLarge(parents_ele){
        const newMaxHeight = parents_ele.dataset.initmaxheight;
        parents_ele.style.maxHeight = `calc(${newMaxHeight}px)`;
        parents_ele.style.minHeight = 0;
    }
    slideUpMiddle(node){
        console.log(`node ; ${node.classList}`);
        const parents = this.parentsNodeArray(node);
        const gapHeight = node.parentNode.clientHeight - node.parentNode.dataset.initmaxheight
        console.log(`gapHeight : ${gapHeight}`);

        parents.forEach(element => {
            const newMaxHeight = element.clientHeight - gapHeight;
            element.style.maxHeight = `calc(${newMaxHeight}px)`;
            element.style.minHeight = `calc(${newMaxHeight}px)`;
        });
    }

}

export const animation = new Animation();