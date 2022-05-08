class newDiagnosisCategory{
    constructor(){
        this.colors = [
            '#D8E2DC',
            '#FFE5D9',
            '#FFCAD4',
            '#F4ACB7',
            '#C6B5BA',
        ];
        this.romeNum =[
            'Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','XVII','XVIII',	'XV'
        ]
        this.colorselect = this.colors.slice();//selectcolor을 위한 변수
        this.previouscolor= null;
        this.createcontent();
    }
    createcontent(){
        const maincontentdiv = document.querySelector('.dia_cat_mainContent');
        maincontentdiv.classList.add('maincontentdiv');

        const largeDiagnoses = knowledgeData.large_diagnoses;
        const largeToMediums = knowledgeData.large_to_mediums;
        const mediumToSmall = knowledgeData.medium_to_smalls;

        let largecount = 0;// 대진단 앞에 붙일 로마숫자
        largeDiagnoses.forEach(element => {
            let count = 1; //중진단 앞에 붙일 count

            const largeitem = element;
            const middleDiagnoses = largeToMediums[largeitem];
            
            const newlargeitem = document.createElement('div');
            newlargeitem.classList.add('largeitem');

            const largeitemtitle = document.createElement('div');
            largeitemtitle.innerHTML =`<h1 class='largeitemtitle'>${this.romeNum[largecount]}. ${largeitem}</h1>`;
            newlargeitem.appendChild(largeitemtitle);

            middleDiagnoses.forEach(ele => {
                const middleitem = ele;
                const smalldiagnoses = mediumToSmall[middleitem];
                this.colorselect = this.colors.slice();//item색 리셋

                if(smalldiagnoses.length > 0){
                    const subcontent = document.createElement('div');
                    subcontent.classList.add('subcontent');
    
                    //subcontent title 넣기
                    const titlediv = this.createTitle(middleitem, count);
                    subcontent.appendChild(titlediv);
                    
                    //subcontent item넣기
                    const itembox = document.createElement('div');
                    itembox.classList.add('itembox');
    
                    smalldiagnoses.forEach(element => {
                        const itemdiv = this.createitem(element.name, element.id);
                        itembox.appendChild(itemdiv);
                    });
                    subcontent.appendChild(itembox);
    
                    //subcontent를 newlargeitem에 넣기
                    newlargeitem.appendChild(subcontent);

                    //숫자 올려주기
                    count++;
                }
            });

            //newlargeitem을 maincontent에 넣기
            maincontentdiv.appendChild(newlargeitem);
            largecount++;
        });
    }

    createTitle(middle, count){
        const titlediv = document.createElement('div');
        titlediv.classList.add('titlediv');
        titlediv.innerHTML = `<h2>${count}. ${middle}</h2>`;

        return titlediv;
    }

    createitem(name, id){
        const newitem = document.createElement('div');
        newitem.classList.add('item');

        //배경색 지정
        const color = this.selectcolor();
        newitem.style.backgroundColor = `${color}`;

        //클릭시 페이지 이동
        const url = `/knowledges/diagnosis/${id}`;
        newitem.textContent = `${name}`;
        newitem.addEventListener('click',()=>{
            window.location.href=`${url}`;
        });

        return newitem;
    }

    selectcolor(){
        if(this.colorselect.length){
            const colornum = Math.random() * (this.colorselect.length);
            const color = this.colorselect.splice(colornum, 1);
            if(this.previouscolor == color){
                return this.selectcolor();
            }
            else{
                this.previouscolor = color;
                return color;
            }
        }
        else{
            this.colorselect = this.colors.slice();
            return this.selectcolor();
        }

    }
}

window.onload = ()=>{
    new newDiagnosisCategory();
}