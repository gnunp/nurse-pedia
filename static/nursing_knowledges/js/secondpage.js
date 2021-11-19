
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

import secondpage_css from '../css/secondpage.css'

export class Secondpage{
    constructor(){
        this.makedata = new MakeData();

        this.setpageSize();

        this.makepage();
    }

    setpageSize(){
        // resize이벤트에 맞게 페이지 크기조절 
        const headerHeight = 80; // 헤더height를 직접줌 : 헤더height가 0으로 설정후 absolute로 위치 맞춰 놓여져있어서 height값을 가져올 수 없음
        const bottom_margin = 30;

        const secondpage = document.querySelector('.secondpage');
        const setHeight = secondpage.clientHeight - headerHeight;
        
        secondpage.style.height = `${setHeight - bottom_margin}px`;
        secondpage.style.top = `${headerHeight}px`;
    }

    async makepage(){
        this.data = [];
        this.diseasedata = await this.makedata.getDisease();
        this.diagnosesdata = await this.makedata.getDiagnoses();
        this.connectdisTodiadata = await this.makedata.getConnectdisTodia();

        await this.diseasedata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.diagnosesdata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.connectdisTodiadata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        console.log(this.data);

        this.mindmap();
    }
    
    mindmap(){
        
        const nodeBigSize = 10;
        const nodeSmallSize = 5;
        //const nodeActiveSize = 28;

        const fontBigSize = 5;
        const fontSmallSize = 3;
        //const fontActiveSize = 7;

        const edgeWidth = '1px';
        let edgeActiveWidth = '2px';
        const arrowScale = 0.5;
        const arrowActiveScale = 1.0;

        const dimColor = 'black';
        const edgeColor = 'gray';
        const nodeColor = 'gray';
        const nodeActiveColor = 'red';

        const successorColor = 'yellow';

        const predecessorsColor = 'blue';

        const minZoomlevel = 1;
        const maxzoomlevel = 3;
        const aniZoomlevel = 2;



        const cy = cytoscape({

            container: document.getElementById('cy'), 

            elements: this.data,

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': nodeColor,
                        'label': 'data(label)',
                        
                        'width': function (ele) {
                            if(ele.data("type") == "big"){
                                return nodeBigSize;
                            }
                            else{
                                return nodeSmallSize;
                            }
                        },
                        'height': function (ele) {
                            if(ele.data("type") == "big"){
                                return nodeBigSize;
                            }
                            else{
                                return nodeSmallSize;
                            }
                        },
                        'font-size': function (ele) {
                            if(ele.data("type") == "big"){
                                return fontBigSize;
                            }
                            else{
                                return fontSmallSize;
                            }
                        },

                        'color' : nodeColor
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': edgeWidth,
                        'curve-style' : 'bezier',
                        'line-color': edgeColor,
                        'source-arrow-color': edgeColor,
                        'source-arrow-shape': 'vee',
                        'arrow-scale': arrowScale,
                    }
                }
            ],

            layout: {
                name: 'cose-bilkent',
                animate: false,
                graviyRangeCompound: 1.5,
                fit: true,
                tile : true
            }

        });

        cy.minZoom(minZoomlevel); //최소 줌
        cy.maxZoom(maxzoomlevel); //최대 줌
        cy.autolock(true); // 노드 드래그로 움직이지 못하게 하는 것

        function setDimStyle(target_cy, style){
            target_cy.nodes().forEach(function(target){
                target.style(style);
            });
            target_cy.edges().forEach(function(target){
                target.style(style);
            });
        }

        function setFocus(target_element, successorColor, predecessorsColor, edgeWidth, arrowScale){
            //마우스-오버된 노드 색 설정
            target_element.style('background-color', nodeActiveColor);
            
            //마우스-오버된 화살표 크기
            target_element.style('arrow-scale', arrowScale);

            //마우스-오버된 노드 윗노드 스타일 설정
            target_element.successors().each(function(e){

                e.style('background-color', 'blue');//노드색
                e.style('line-color', 'green');//라인색
                e.style('color', 'yellow');//텍스트 색
                e.style('source-arrow-color', 'yellow'); //화살표 색
                setOpacityElement(e, 0.5); // 투명도
            });

            // 마우스-오버된 노드 아랫노드 스타일 지정
            target_element.predecessors().each(function(e){
                e.style('background-color', 'blue');//노드색
                e.style('line-color', 'green');//라인색
                e.style('color', 'yellow');//텍스트 색
                e.style('source-arrow-color', 'yellow'); //화살표 색
                setOpacityElement(e, 0.5); // 투명도
            });

            //바로 아래 또는 바로 위는 투명도 없애기
            target_element.neighborhood().each(function(e){
                setOpacityElement(e,1);
            });

            //노드크기 설정
            /*
            target_element.style('width', Math.max(parseFloat(target_element.style('width')), nodeActiveSize));
            target_element.style('height', Math.max(parseFloat(target_element.style('height')), nodeActiveSize));
            target_element.style('font-size', Math.max(parseFloat(target_element.style('font-size')), fontActiveSize));
            */
        }

        //투명도 주는 함수
        function setOpacityElement(target_element, degree){
            target_element.style('opacity', degree);
        }

        //마우스 밖으로 나갔을 때 실행
        function setRestFocus(target_cy){

            //노드 스타일
            target_cy.nodes().forEach(function(target){
                target.style('background-color', nodeColor);
                target.style('color', dimColor);
                if(target.data("type") == "big"){
                    
                    //diseas노드만 실행

                }
                else if(target.data("type")=="small"){

                    //diagonose노드만 실행
                }
            });
            
            //화살표 스타일
            target_cy.edges().forEach(function(target){
                target.style('line-color', edgeColor);
                target.style('source-arrow-color', edgeColor);
                target.style('width', edgeWidth);
                target.style('arrow-scale', arrowScale);
                target.style('opacity', 1);
            });
        }

        // node 하이퍼 링크
        cy.on('tap', function(e){
            const url = e.target.data('url');
            if (url && url != ''){
                window.open(url);
            }
        });


        //노드위에 커서 올렸을 때
        cy.on('tapstart mouseover', 'node', function(e){

            // 커서 올라오면 그 노드에 맞춰서 화면 조정 애니메이션
            cy.clearQueue()
            .animate({
                fit: {
                    eles: e.target,
                    padding: 10 
                },
                zoom: aniZoomlevel
            },{
                duration: 1000
            }); 

            //선택 제외 나머지 노드&화살표 연하게 처리
            setDimStyle(cy, {
                'background-color' : dimColor,
                'line-color':dimColor,
                'source-arrow-color': dimColor,
                'color': dimColor
            });

            //선택 된 노드 스타일
            setFocus(e.target, successorColor, predecessorsColor, edgeActiveWidth, arrowActiveScale);
        });

        // 마우스 내렸을 때
        cy.on('tapend mouseout', 'node', async function(e){
            
            cy.clearQueue().animate({
                pan:{
                    x:0,
                    y:0
                },
                zoom: minZoomlevel
            },{
                duration:1000
            });;
            setRestFocus(e.cy);

        });

        let resizeTimer;

        window.addEventListener('resize', function(){
            this.clearTimeout(resizeTimer);
            resizeTimer = this.setTimeout(function(){
                cy.fit();
            },200);
        });
    }
}

export class MakeData{ 
    /*
    APIView에서 데이터 가져옴
    -> cy에서 원하는 형태의 data로 가공 
    -> 배열에 넣어서 전달
    */
    async getDisease(){
        let id, url, label, item;
        let diseaseArr = [];

        const disease = await fetch('/api/knowledges/diseases');
        const disease_objects = await disease.json();

        disease_objects.forEach(element => {
          
            id = "dis"+(element.id).toString();
            url = '#';
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"big",
                }
            });
            diseaseArr.push(item);
        });

        return diseaseArr;
    }

    async getDiagnoses(){
        let id, url, label, item;
        let diagnosesArr = [];

        const diagnoses = await fetch('/api/knowledges/diagnoses');
        const diagnoses_objects = await diagnoses.json();

        diagnoses_objects.forEach(element => {
            id = "dia"+(element.id).toString();
            url = '#';
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id": id,
                    "url": url,
                    "label": label,
                    "type":"small",
                }
            });
            diagnosesArr.push(item);
        });

        return diagnosesArr;
    }

    async getConnectdisTodia(){
        let id, source, target, item;
        let connectdisNdiaArr = [];

        const connectdisTodia = await fetch('/api/knowledges/disease-to-diagnosis');
        const connectdisTodia_objects = await connectdisTodia.json();

        connectdisTodia_objects.forEach(element => {
            target = "dis"+(element.disease.id).toString();
            source = "dia"+(element.diagnosis.id).toString();
            id = source + "->" + target;

            item = JSON.stringify({
                "data":{
                    "id": id,
                    "source": source,
                    "target": target
                }
            });
            connectdisNdiaArr.push(item);
        });

        return connectdisNdiaArr;
    }
}